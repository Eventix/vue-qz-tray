<template>
    <div class="vue-qz-tray--container vue-qz-tray--printers"
            v-if="hasParent && !hide">
        <div class="vue-qz-tray--printers--header--wrapper"
                v-if="!hideHeader">
            <div class="vue-qz-tray--printers--label--wrapper">
                <slot name="label">
                    <h4 class="vue-qz-tray--printers--label">Choose printer</h4>
                </slot>
            </div>

            <div class="vue-qz-tray--printers--selected-printer--wrapper">
                <slot name="selected-printer"
                        :loading="loading"
                        :selectedPrinter="selectedPrinter">
                    <h3 class="vue-qz-tray--printers--selected-printer"
                            v-if="selectedPrinter">{{ selectedPrinter }}</h3>
                    <h5 class="vue-qz-tray--printers--loading"
                            v-else-if="loading">Loading</h5>
                    <h6 class="vue-qz-tray--printers--unknown"
                            v-else>Unknown</h6>
                </slot>
            </div>
        </div>

        <slot></slot>

        <div class="vue-qz-tray--printers--list--wrapper"
                v-if="!hideBody">
            <slot name="list-printers"
                    :printers="printers"
                    :selectedPrinter="selectedPrinter"
                    :pickPrinter="pickPrinter"
                    :failed="failed"
                    :loading="loading">

                <h6 class="vue-qz-tray--printers--list-loading"
                        v-if="loading">
                    Loading
                </h6>

                <h6 class="vue-qz-tray--printers--list-failed"
                        v-else-if="failed">
                    Error
                </h6>

                <h6 class="vue-qz-tray--printers--list-empty"
                        v-else-if="!printers || !printers.length">
                    No printers found
                </h6>

                <div class="vue-qz-tray--printers--list-items"
                        v-else>
                    <slot name="list-printers-select"
                            :printers="printers"
                            :selectedPrinter="selectedPrinter"
                            :pickPrinter="pickPrinter"
                            :failed="failed"
                            :loading="loading">
                        <ul>
                            <li class="vue-qz-tray--printers--list-item"
                                    v-for="printer in printers"
                                    :key="printer">
                                <a class="vue-qz-tray--printers--printer--link"
                                        :class="{selected: selectedPrinter === printer}"
                                        @click="pickPrinter(printer)">
                                    <span class="vue-qz-tray--printers--printer--link--content">
                                        {{ printer }}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </slot>
                </div>

            </slot>
        </div>
    </div>
</template>

<script>
    import QzMixin from './qz-mixin';

    export default {
        name: 'VueQzTrayPrinters',

        label: 'printers',

        mixins: [QzMixin],

        props: {
            printer: String
        },

        data: function() {
            return {
                failed: false,
                loading: false,
                printers: null,
                selectedPrinter: ''
            };
        },

        computed: {
            defaultPrinter: function() {
                return this.printer;
            }
        },

        watch: {
            selectedPrinter: {
                immediate: true,
                handler: function(newPrinter, oldPrinter) {
                    this.$emitLocalAndRoot('printer-changed', newPrinter, oldPrinter);
                }
            },

            defaultPrinter: {
                immediate: true,
                handler: function() {
                    this.testDefaultPrinter();
                }
            }
        },

        methods: {
            retrievePrintersIfConnection: function(newConnectionStatus) {
                if (newConnectionStatus) {
                    this.getPrinters();
                } else {
                    this.printers = null;
                }
            },

            getPrinters: function() {
                if (!this.qzIsInitialized()) {
                    return;
                }

                if (this.loading || !this.qzTrayConnected) {
                    console.warn('No active connection with QZ exists.');

                    this.$emitLocalAndRoot('connection-not-exists-warning');

                    return;
                }

                this.failed = false;
                this.loading = true;

                this.$qz.printers.find()
                    .then(this.printersResolve)
                    .catch(this.websocketError)
                    .finally(this.printersFinally);
            },

            pickPrinter: function(printer) {
                if (!this.printers || !this.printers.length || this.printers.indexOf(printer) < 0) {
                    this.selectedPrinter = '';

                    if (!this.printers || !this.printers.length) {
                        this.$emitLocalAndRoot('printers-empty-error');
                    }

                    this.$emitLocalAndRoot('printer-invalid-error', printer, this.printers);

                    return;
                }

                this.selectedPrinter = printer;

                this.$emitLocalAndRoot('printer-set-success', printer);
            },

            testDefaultPrinter: function() {
                if (this.selectedPrinter && this.selectedPrinter.length && this.printers && this.printers.indexOf(this.selectedPrinter) > -1) {
                    return;
                }

                if (this.defaultPrinter && this.defaultPrinter.length) {
                    this.pickPrinter(this.defaultPrinter);
                }
            },

            printersResolve: function(data) {
                this.printers = data;
                this.failed = false;

                this.testDefaultPrinter();

                this.$emitLocalAndRoot('retrieved-success');
            },

            websocketError: function(error) {
                this.printers = null;
                this.failed = true;

                console.error(error);

                this.$emitLocalAndRoot('websocket-error', error);
            },

            printersFinally: function() {
                this.loading = false;
            }
        },

        created: function() {
            if (this.$qzRoot) {
                this.$onRoot('connect-connection-changed', this.retrievePrintersIfConnection);
            }
        },

        beforeDestroy: function() {
            if (this.$qzRoot) {
                this.$offRoot('connect-connection-changed', this.retrievePrintersIfConnection);
            }
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style .vue-qz-tray--printers {
        .vue-qz-tray--printers--header--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--printers--label--wrapper, .vue-qz-tray--printers--selected-printer--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                .vue-qz-tray--printers--label, .vue-qz-tray--printers--selected-printer, .vue-qz-tray--printers--unknown, .vue-qz-tray--printers--loading {
                    display: inline-block;
                    position: relative;

                    margin: 0;
                    padding: 0;
                }

                &:first-child {
                    margin-left: 0;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            .vue-qz-tray--printers--selected-printer--wrapper {
                float: right;
            }
        }

        .vue-qz-tray--printers--list--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--printers--list-items, .vue-qz-tray--printers--list-empty, .vue-qz-tray--printers--list-loading, .vue-qz-tray--printers--list-items > ul {
                display: block;
                position: relative;

                width: 100%;

                margin: 0;
                padding: 0;

                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }

            .vue-qz-tray--printers--list-items .vue-qz-tray--printers--list-item {
                display: block;
                position: relative;

                width: 100%;

                margin: 0;
                padding: 0;

                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;

                .vue-qz-tray--printers--printer--link {
                    display: inline-block;
                    position: relative;

                    width: 100%;

                    line-height: 1.2em;
                    cursor: pointer;
                    text-decoration: none;

                    &:hover, &.selected, &:active {
                        text-decoration: underline;
                    }

                    &.selected, &:active {
                        left: 5px;

                        .vue-qz-tray--printers--printer--link--content::before {
                            content: '> ';
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
</style>
