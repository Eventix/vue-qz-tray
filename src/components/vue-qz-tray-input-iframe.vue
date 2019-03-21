<template>
    <iframe class="vue-qz-tray--input--iframe" src="about:blank" @load="updateIframe"></iframe>
</template>

<script>
    export default {
        name: 'VueQzTrayInputIframe',

        props: {
            page: String
        },

        watch: {
            page: {
                immediate: true,
                handler: function() {
                    this.updateIframe();
                }
            }
        },

        methods: {
            updateIframe: function() {
                let iframe = this.$el;

                if (this.page && this.page.length && iframe) {
                    iframe.contentWindow.document.open('text/html', 'replace');
                    iframe.contentWindow.document.write(this.page);
                    iframe.contentWindow.document.close();
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--input--iframe {
        display: block;
        position: relative;

        width: 100%;
        min-height: 400px;

        margin: 0;
        padding: 0;

        background: #ffffff;
        border: 1px solid #d3d3d3;
    }
</style>
