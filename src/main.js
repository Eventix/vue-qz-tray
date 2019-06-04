import Vue from 'vue';
import App from './App.vue';
require('./components/entry.js');

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
