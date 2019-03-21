import Vue from 'vue';
import VueQzTray from './vue-qz-tray';
import VueQzTrayAction from './vue-qz-tray-action.vue';
import VueQzTrayConnect from './vue-qz-tray-connect.vue';
import VueQzTrayFormElement from './vue-qz-tray-form-element.vue';
import VueQzTrayFormNested from './vue-qz-tray-form-nested.vue';
import VueQzTrayInput from './vue-qz-tray-input.vue';
import VueQzTrayOptions from './vue-qz-tray-options.vue';
import VueQzTrayPrinters from './vue-qz-tray-printers.vue';

const Components = {
    VueQzTray,
    VueQzTrayAction,
    VueQzTrayConnect,
    VueQzTrayFormElement,
    VueQzTrayFormNested,
    VueQzTrayInput,
    VueQzTrayOptions,
    VueQzTrayPrinters
};

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;
