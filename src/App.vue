<template>
    <div id="app">
        <vue-qz-tray>
            <vue-qz-tray-connect></vue-qz-tray-connect>

            <vue-qz-tray-printers></vue-qz-tray-printers>

            <vue-qz-tray-options></vue-qz-tray-options>

            <vue-qz-tray-input :pages="['<html><head></head><body>Test Print<br><br>Second line</body></html>']"></vue-qz-tray-input>

            <vue-qz-tray-action></vue-qz-tray-action>
        </vue-qz-tray>
    </div>
</template>

<script>
    export default {
        name: 'app'
    };
</script>

<style lang="less">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
