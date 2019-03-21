<template>
    <div class="vue-qz-tray--container vue-qz-tray--action"
            v-if="hasParent && !hide">
        <div class="vue-qz-tray--action--header--wrapper"
                v-if="!hideHeader">
            <div class="vue-qz-tray--action--label--wrapper">
                <slot name="label">
                    <h4 class="vue-qz-tray--action--label">Print</h4>
                </slot>
            </div>
        </div>

        <slot></slot>

        <div class="vue-qz-tray--action--action--wrapper"
                v-if="!hideBody">
            <div class="vue-qz-tray--action--status--wrapper">
                <slot name="status"
                        :status="status">
                    <span class="vue-qz-tray--action--status">{{ status }}</span>
                </slot>
            </div>

            <div class="vue-qz-tray--action--print--wrapper">
                <slot name="button-print"
                        :print="print"
                        :actionStatus="actionStatus">
                    <button class="vue-qz-tray--action--print--button vue-qz-tray--button"
                            :disabled="actionStatus.loading || !qzTrayConnected || !printerSelected || !pagesCount"
                            @click="print">Print
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import QzMixin from './qz-mixin';

    export default {
        name: 'VueQzTrayAction',

        label: 'action',

        mixins: [QzMixin],

        data: function() {
            return {
                actionStatus: {}
            };
        },

        computed: {
            status: function() {
                if (this.actionStatus.failed) {
                    return 'Error';
                }

                if (this.actionStatus.loading) {
                    return 'Printing...';
                }

                if (!this.qzTrayConnected) {
                    return 'No connection';
                }

                if (!this.printerSelected) {
                    return 'No printer selected';
                }

                if (!this.pagesCount) {
                    return 'No pages to print';
                }

                if (this.actionStatus.printed) {
                    return 'Printed';
                }

                return 'Ready';
            }
        },

        methods: {
            print: function() {
                // eslint-disable-next-line no-console
                console.log('START PRINT');

                if (!this.qzIsInitialized()) {
                    return;
                }

                if (!this.$qzRoot) {
                    console.error('Vue QZ Tray not initialized properly.');

                    this.$emitLocalAndRoot('vue-qz-tray-not-initialized-error');

                    return;
                }

                if (this.actionStatus.loading || !this.qzTrayConnected) {
                    console.error('No active connection with QZ exists.');

                    this.$emitLocalAndRoot('connection-not-exists-error');

                    return;
                }

                this.actionStatus.loading = true;
                this.actionStatus.failed = false;

                this.$qzRoot.startPrint()
                    .then(() => {
                        // eslint-disable-next-line no-console
                        console.log('SUCCESS PRINT');

                        this.actionStatus.printed = true;
                    })
                    .catch(error => {
                        console.error('ERROR PRINT', error);

                        this.actionStatus.failed = true;
                    })
                    .finally(() => {
                        this.actionStatus.loading = false;
                    });
            }
        },

        mounted: function() {
            if (this.$qzRoot) {
                this.actionStatus = this.$qzRoot.actionStatus;
            }
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style .vue-qz-tray--action {
        .vue-qz-tray--action--header--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--action--label--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                .vue-qz-tray--action--label {
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
        }

        .vue-qz-tray--action--action--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--action--print--wrapper, .vue-qz-tray--action--status--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                &:first-child {
                    margin-left: 0;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            .vue-qz-tray--action--print--wrapper {
                float: right;
            }
        }
    }
</style>
