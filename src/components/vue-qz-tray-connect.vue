<template>
    <div class="vue-qz-tray--container vue-qz-tray--connect"
            v-if="hasParent && !hide">
        <div class="vue-qz-tray--connect--header--wrapper"
                v-if="!hideHeader">
            <div class="vue-qz-tray--connect--label--wrapper">
                <slot name="label">
                    <h4 class="vue-qz-tray--connect--label">QZ Tray</h4>
                </slot>
            </div>

            <div class="vue-qz-tray--connect--status--wrapper">
                <slot name="status"
                        :connectionStatus="connectionStatus">
                    <h3 class="vue-qz-tray--connect--status">
                        {{ connectionStatus }}
                    </h3>
                </slot>
            </div>
        </div>

        <slot></slot>

        <div class="vue-qz-tray--connect--connection--wrapper"
                v-if="!hideBody">
            <div class="vue-qz-tray--connect--connect--wrapper">
                <slot name="button-connect"
                        :connect="connect"
                        :connected="connected"
                        :loading="loading">
                    <button class="vue-qz-tray--connect--connect--button vue-qz-tray--button"
                            v-show="!connected"
                            :disabled="loading"
                            @click="connect">Connect
                    </button>
                </slot>
            </div>

            <div class="vue-qz-tray--connect--disconnect--wrapper">
                <slot name="button-disconnect"
                        :disconnect="disconnect"
                        :connected="connected"
                        :loading="loading">
                    <button class="vue-qz-tray--connect--disconnect--button vue-qz-tray--button"
                            v-show="connected"
                            :disabled="loading"
                            @click="disconnect">Disconnect
                    </button>
                </slot>
            </div>

            <div class="vue-qz-tray--connect--launch--wrapper">
                <slot name="button-launch"
                        :launch="launch"
                        :connected="connected"
                        :loading="loading">
                    <button class="vue-qz-tray--connect--launch--button vue-qz-tray--button"
                            v-show="!connected"
                            :disabled="loading"
                            @click="launch">Launch QZ Tray
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import QzMixin from './qz-mixin';

    export default {
        name: 'VueQzTrayConnect',

        label: 'connect',

        mixins: [QzMixin],

        props: {
            certificatePromiseCallback: {
                type: Function,
                default: null
            },

            signaturePromiseCallback: {
                type: Function,
                default: null
            }
        },

        data: function() {
            return {
                connected: false,
                connecting: false,
                disconnecting: false,
                failed: false
            };
        },

        computed: {
            loading: function() {
                return this.connecting || this.disconnecting;
            },

            connectionStatus: function() {
                if (this.failed) {
                    return 'Error';
                }

                if (this.disconnecting) {
                    return 'Disconnecting';
                }

                if (this.connecting) {
                    return 'Connecting';
                }

                return this.connected ? 'Connected' : 'Disconnected';
            }
        },

        watch: {
            connected: {
                immediate: true,
                handler: function(newConnected, oldConnected) {
                    this.$emitLocalAndRoot('connection-changed', newConnected, oldConnected);
                }
            }
        },

        methods: {
            launch: function() {
                if (!this.qzIsInitialized()) {
                    return;
                }

                if (this.loading || this.$qz.websocket.isActive()) {
                    this.$emitLocalAndRoot('connection-exists-warning');

                    return;
                }

                window.location.assign("qz:launch");

                this.connect();
            },

            connect: function() {
                if (!this.qzIsInitialized()) {
                    return;
                }

                if (this.loading || this.$qz.websocket.isActive()) {
                    console.warn('An active connection with QZ already exists.');

                    this.$emitLocalAndRoot('connection-exists-warning');

                    return;
                }

                this.failed = false;
                this.connecting = true;

                this.$qz.websocket.connect(this.$qzConfig.connect)
                    .then(this.connectResolve)
                    .catch(this.websocketError)
                    .finally(this.connectFinally);
            },

            disconnect: function() {
                if (!this.qzIsInitialized()) {
                    return;
                }

                if (this.loading || !this.$qz.websocket.isActive()) {
                    console.warn('No active connection with QZ exists.');

                    this.$emitLocalAndRoot('connection-not-exists-warning');

                    return;
                }

                this.failed = false;
                this.disconnecting = true;

                this.$qz.websocket.disconnect()
                    .then(this.disconnectResolve)
                    .catch(this.websocketError)
                    .finally(this.disconnectFinally);
            },

            websocketError: function(error) {
                this.failed = true;
                this.connected = false;
                this.connecting = false;
                this.disconnecting = false;

                console.error(error);

                if (error.target !== undefined && error.target.readyState >= 2) {
                    // readyState >= 2, means CLOSING or CLOSED
                    this.$emitLocalAndRoot('connection-closing-error', error);
                } else {
                    this.$emitLocalAndRoot('connection-websocket-error', error);
                }
            },

            websocketClosed: function(closeEvent) {
                this.connected = false;
                this.connecting = false;
                this.disconnecting = false;

                if (closeEvent.reason) {
                    console.warn('Connection closed:', closeEvent.reason);
                }

                this.$emitLocalAndRoot('connection-closed', closeEvent);
            },

            connectResolve: function() {
                this.connected = true;
                this.failed = false;

                this.$emitLocalAndRoot('connection-success');
            },

            connectFinally: function() {
                this.connecting = false;
            },

            disconnectResolve: function() {
                this.connected = false;
                this.failed = false;

                this.$emitLocalAndRoot('disconnection-success');
            },

            disconnectFinally: function() {
                this.disconnecting = false;
            }
        },

        created: function() {
            if (this.$qz && this.$qz.security) {
                if (this.certificatePromiseCallback) {
                    this.$qz.security.setCertificatePromise(this.certificatePromiseCallback);
                }

                if (this.signaturePromiseCallback) {
                    this.$qz.security.setSignaturePromise(this.signaturePromiseCallback);
                }
            }
        },

        mounted: function() {
            if (!this.qzIsInitialized()) {
                return;
            }

            this.$qz.websocket.setClosedCallbacks(this.websocketClosed);
            this.$qz.websocket.setErrorCallbacks(this.websocketError);

            if (this.$qz.websocket.isActive()) {
                this.connected = true;
            } else {
                this.launch();
            }
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style .vue-qz-tray--connect {
        .vue-qz-tray--connect--header--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--connect--label--wrapper, .vue-qz-tray--connect--status--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                .vue-qz-tray--connect--label, .vue-qz-tray--connect--status {
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

            .vue-qz-tray--connect--status--wrapper {
                float: right;
            }
        }

        .vue-qz-tray--connect--connection--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--connect--connect--wrapper, .vue-qz-tray--connect--disconnect--wrapper, .vue-qz-tray--connect--launch--wrapper {
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

            .vue-qz-tray--connect--launch--wrapper {
                float: right;
            }
        }
    }
</style>
