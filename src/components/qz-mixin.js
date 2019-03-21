export default {
    props: {
        hide: {
            type: Boolean,
            default: false
        },

        hideHeader: {
            type: Boolean,
            default: false
        },

        hideBody: {
            type: Boolean,
            default: false
        },

        options: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },

    data: function() {
        return {
            hasParent: false,
            qzOptions: {}
        };
    },

    computed: {
        qzTrayConnected: function() {
            return this.$qzRoot ? !!this.$qzRoot.qzConnected : false;
        },

        printerSelected: function() {
            return this.$qzRoot ? !!this.$qzRoot.qzPrinter : false;
        },

        pagesCount: function() {
            return (this.$qzRoot && this.$qzRoot.qzPages) ? this.$qzRoot.qzPages.length : 0;
        }
    },

    watch: {
        qzOptions: {
            handler: function(newOptions) {
                this.$emitLocalAndRoot('options-changed', newOptions);
            },
            immediate: true,
            deep: true
        },

        options: {
            handler: function(newOptions) {
                Object.assign(this.qzOptions, newOptions);
            },
            deep: true
        }
    },

    methods: {
        qzIsInitialized: function() {
            let initialized = this.$qz && this.$qz.version && this.$qz.websocket;

            if (!initialized) {
                console.error('VueQzTray: QZ not initialized');

                this.$emitLocalAndRoot('vue-qz-tray-init-error');
            }

            return initialized;
        },

        resetOptions: function() {
            if (!this.$qzConfig) {
                return;
            }

            this.qzOptions = JSON.parse(JSON.stringify(Object.assign({}, this.$qzConfig[this.$options.label] || {}, this.options)));
        },

        $emitLocalAndRoot: function(eventName, ...args) {
            this.$emitRoot(eventName, ...args);

            return this.$emit(eventName, ...args);
        },

        $emitRoot: function(eventName, ...args) {
            if (this.$qzRoot) {
                return this.$qzRoot.$emit(this.$options.label + '-' + eventName, ...args);
            }

            return null;
        },

        $onRoot: function(eventName, callback) {
            if (this.$qzRoot) {
                return this.$qzRoot.$on(eventName, callback);
            }

            return null;
        },

        $offRoot: function(eventName, callback) {
            if (this.$qzRoot) {
                return this.$qzRoot.$off(eventName, callback);
            }

            return null;
        }
    },

    created: function() {
        if (this.$qz && this.$qz.version) {
            this.hasParent = true;
        }

        this.resetOptions();
    },

    inject: {
        $qz: {
            default: function() {
                console.error('VueQzTray: QZ not injected');

                return null;
            }
        },

        $qzRoot: {
            default: function() {
                console.error('VueQzTray: VueQzTray should be a parent of this component');

                return null;
            }
        },

        $qzConfig: {
            default: function() {
                console.error('VueQzTray: VueQzTray should be a parent of this component');

                return null;
            }
        }
    }
};
