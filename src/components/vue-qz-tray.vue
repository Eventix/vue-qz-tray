<template>
    <div class="vue-qz-tray" :class="{'vue-qz-tray--with-style': withStyling}">
        <slot></slot>
    </div>
</template>

<script>
    import * as qz from 'qz-tray';
    import {sha256} from 'js-sha256';
    import QzConfig from './qz-default-config.js';

    export default {
        name: 'VueQzTray',

        label: 'base',

        props: {
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },

        data: function() {
            return {
                $qz: null,
                defaultConfig: QzConfig,

                qzConnected: false,
                qzPrinter: '',
                qzPrintOptions: JSON.parse(JSON.stringify(QzConfig['print-options'] || {})),
                qzInput: JSON.parse(JSON.stringify(QzConfig['input'] || {})),
                qzPages: [],

                actionStatus: {
                    loading: false,
                    printed: false,
                    failed: false
                }
            };
        },

        computed: {
            $qzConfig: function() {
                return Object.assign({}, this.defaultConfig, this.config);
            },

            withStyling: function() {
                return !!this.$qzConfig.base.styling;
            }
        },

        methods: {
            connectionChanged: function(newValue) {
                this.qzConnected = newValue;
            },

            printerChanged: function(newValue) {
                this.qzPrinter = newValue;
            },

            optionsChanged: function(newValue) {
                this.qzPrintOptions = newValue;
            },

            inputChanged: function(newValue) {
                this.qzInput = newValue;
            },

            inputPagesChanged: function(newValue) {
                this.qzPages = newValue;
            },

            startPrint: function() {
                return this.validateForPrint()
                    .then(this.getPrinterConfig)
                    .then(config => {
                        let data = [];

                        this.qzPages.forEach(page => {
                            let pageData = JSON.parse(JSON.stringify(this.qzInput));

                            if (typeof page === 'string' || page instanceof String) {
                                pageData.data = page;
                            } else {
                                pageData.data = page.data;
                            }

                            data.push(pageData);

                        });

                        return this.$qz.print(config, data);
                    }).then(() => {
                        this.$emit('printed');
                    });
            },

            validateForPrint: function() {
                // TODO extend validation??

                if (!this.qzPrinter || !this.qzPrinter.length) {
                    return Promise.reject(['No printer selected', this.qzPrinter]);
                }

                if (!this.qzPrintOptions) {
                    return Promise.reject(['No printer options available', this.qzPrintOptions]);
                }

                if (!this.qzInput || !this.qzInput.type || !this.qzInput.type.length) {
                    return Promise.reject(['No (valid) input available', this.qzInput]);
                }

                if (!this.qzPages || !this.qzPages.length) {
                    return Promise.reject(['No (valid) pages available', this.qzPages]);
                }

                let invalidPages = [];

                this.qzPages.forEach(page => {
                    if ((typeof page === 'string' || page instanceof String)) {
                        if (!page.length) {
                            invalidPages.push(page);
                        }
                    } else if (!page.data || !page.data.length) {
                        invalidPages.push(page);
                    }
                });

                if (invalidPages.length) {
                    return Promise.reject([invalidPages.length + ' page(s) are invalid', invalidPages]);
                }

                return Promise.resolve();
            },

            getPrinterConfig: function() {
                return this.$qz.configs.create(this.qzPrinter, this.mapConfig(this.qzPrintOptions));
            },

            mapConfig: function(qzPrintOptions) {
                let printerOptions = {};

                let mapConfig = this.mapConfig;

                Object.keys(qzPrintOptions).map(function(key) {
                    if (!qzPrintOptions.hasOwnProperty(key)) {
                        console.error('ignoring because not own property', qzPrintOptions);

                        return;
                    }

                    if (!qzPrintOptions[key].hasOwnProperty('value')) {
                        console.error('ignoring, because no value key', qzPrintOptions[key]);

                        return;
                    }

                    let value = qzPrintOptions[key].value;

                    printerOptions[key] = (value && Object.prototype.toString.call(value) === '[object Object]') ? mapConfig(value) : value;
                });

                return printerOptions;
            }
        },

        beforeCreate: function() {
            // SETUP AND INITIALIZATION OF QZ
            // (if needed)
            if (this.$root.$qz) {
                this.$qz = this.$root.$qz;

                return;
            }

            qz.api.setSha256Type(data => sha256(data));
            qz.api.setPromiseType(resolver => new Promise(resolver));

            this.$root.$qz = this.$qz = qz;
        },

        created: function() {
            this.$on('connect-connection-changed', this.connectionChanged);

            this.$on('printers-printer-changed', this.printerChanged);

            this.$on('print-options-options-changed', this.optionsChanged);

            this.$on('input-options-changed', this.inputChanged);

            this.$on('input-pages-changed', this.inputPagesChanged);
        },

        beforeDestroy: function() {
            this.$off('connect-connection-changed', this.connectionChanged);

            this.$off('printers-printer-changed', this.printerChanged);

            this.$off('print-options-options-changed', this.optionsChanged);

            this.$off('input-options-changed', this.inputChanged);

            this.$off('input-pages-changed', this.inputPagesChanged);
        },

        provide: function() {
            return {
                $qz: this.$root.$qz,
                $qzRoot: this,
                $qzConfig: this.$qzConfig
            };
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style, .vue-qz-tray--with-style::v-deep *:not(.v-icon):not(.fas) {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    .vue-qz-tray--with-style::v-deep {
        .vue-qz-tray--container {
            display: block;
            position: relative;

            width: 100%;

            margin: 15px 0;
            padding: 15px 30px;

            background: #ffffff;
            border: 1px solid #d3d3d3;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }

        .vue-qz-tray--button {
            display: inline-block;
            position: relative;

            margin: 0;
            padding: 8px;

            color: #262626;
            background: #4b8ad0;
            border: 1px solid #3e639d;
        }
    }
</style>
