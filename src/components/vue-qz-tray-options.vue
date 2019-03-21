<template>
    <div class="vue-qz-tray--container vue-qz-tray--options"
            v-if="hasParent && !hide">
        <div class="vue-qz-tray--options--header--wrapper"
                v-if="!hideHeader">
            <div class="vue-qz-tray--options--label--wrapper">
                <slot name="label">
                    <h4 class="vue-qz-tray--options--label">Options</h4>
                </slot>
            </div>

            <div class="vue-qz-tray--options--reset--wrapper">
                <slot name="button-reset"
                        :reset="reset">
                    <button class="vue-qz-tray--options--reset--button vue-qz-tray--button"
                            @click="reset">
                        Reset Options
                    </button>
                </slot>
            </div>
        </div>

        <slot></slot>

        <div class="vue-qz-tray--options--wrapper"
                v-if="!hideBody">
            <vue-qz-tray-form-nested
                    :items="qzOptions">
                <template v-for="(slot, slotIndex) in $scopedSlots" #[slotIndex]="{ item, index }">
                    <slot :name="slotIndex"
                            :item="item"
                            :index="index"></slot>
                </template>
            </vue-qz-tray-form-nested>
        </div>
    </div>
</template>

<script>
    import QzMixin from './qz-mixin';
    import VueQzTrayFormNested from './vue-qz-tray-form-nested.vue';

    export default {
        name: 'VueQzTrayOptions',

        label: 'print-options',

        mixins: [QzMixin],

        components: {
            VueQzTrayFormNested
        },

        methods: {
            reset: function() {
                this.resetOptions();
            }
        }

        /* ************************************************************ *
         *                             Note:                            *
         * ************************************************************ *
         *                                                              *
         * qzOptions from QzMixin are used here for all options.        *
         *                                                              *
         * Format:                                                      *
         *                                                              *
         * let qzOptions = {                                            *
         *     ...: {...},                                              *
         *                                                              *
         *     copies: {                                                *
         *         label: 'Copies',                                     *
         *         value: 1,                                            *
         *         type: 'number',                                      *
         *         hidden: false,                                       *
         *     },                                                       *
         *                                                              *
         *     orientation: {                                           *
         *         label: 'orientation',                                *
         *         value: 'portrait',                                   *
         *         type: 'select',                                      *
         *         options: 'portrait|landscape|reverse-landscape'      *
         *         hidden: false,                                       *
         *     },                                                       *
         *                                                              *
         *     ...: {...},                                              *
         * };                                                           *
         *                                                              *
         * ************************************************************ */
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--with-style .vue-qz-tray--options {
        .vue-qz-tray--options--header--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .vue-qz-tray--options--label--wrapper, .vue-qz-tray--options--reset--wrapper {
                display: inline-block;
                position: relative;

                margin: 0 5px;
                padding: 0;

                .vue-qz-tray--options--label, .vue-qz-tray--options--reset--button {
                    display: inline-block;
                    position: relative;

                    margin: 0;
                }

                .vue-qz-tray--options--label {
                    padding: 0;
                }

                &:first-child {
                    margin-left: 0;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            .vue-qz-tray--options--reset--wrapper {
                float: right;
            }
        }

        .vue-qz-tray--options--wrapper {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;
            padding: 15px 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
    }
</style>
