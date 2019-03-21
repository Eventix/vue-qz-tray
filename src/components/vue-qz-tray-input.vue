<template>
    <div class="vue-qz-tray--container vue-qz-tray--input"
            v-if="hasParent && !hide">
        <div class="vue-qz-tray--input--header--wrapper"
                v-if="!hideHeader">
            <div class="vue-qz-tray--input--label--wrapper">
                <slot name="label">
                    <h4 class="vue-qz-tray--input--label">Input</h4>
                </slot>
            </div>

            <div class="vue-qz-tray--input--type--wrapper">
                <slot name="type"
                        :type="type">
                    <h3 class="vue-qz-tray--input--type">{{ type }}</h3>
                </slot>
            </div>
        </div>

        <slot></slot>

        <div class="vue-qz-tray--input--data--wrapper"
                v-if="!hideBody">
            <slot name="pages"
                    :data="pages">
                <div class="vue-qz-tray--input--data">
                    <vue-qz-tray-input-iframe
                            v-for="(page, index) in pages"
                            :key="index"
                            :page="page"></vue-qz-tray-input-iframe>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
    import QzMixin from './qz-mixin';
    import VueQzTrayInputIframe from './vue-qz-tray-input-iframe.vue';

    export default {
        name: 'VueQzTrayInput',

        label: 'input',

        mixins: [QzMixin],

        components: {
            VueQzTrayInputIframe
        },

        props: {
            pages: Array
        },

        computed: {
            type: function() {
                return (this.qzOptions.type && ['html'].indexOf(this.qzOptions.type) < 0) ? 'html' : this.qzOptions.type;
            }
        },

        watch: {
            pages: {
                immediate: true,
                handler: function(newPages) {
                    this.$emitLocalAndRoot('pages-changed', newPages);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style .vue-qz-tray--input {
        .vue-qz-tray--input--header--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--input--label--wrapper, .vue-qz-tray--input--type--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                .vue-qz-tray--input--label, .vue-qz-tray--input--type {
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

            .vue-qz-tray--input--type--wrapper {
                float: right;
            }
        }

        .vue-qz-tray--input--data--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--input--data {
                display: block;
                position: relative;

                width: 100%;

                margin: 0;
                padding: 0;

                zoom: 0.5;

                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
        }
    }
</style>
