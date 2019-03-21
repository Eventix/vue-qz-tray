<template>
    <div class="vue-qz-tray--form-element">
        <!-- Label -->
        <label class="vue-qz-tray--form-element--input vue-qz-tray--input-label"
                :for="'vue-qz-tray-options-' + index"
                v-if="item.type === 'label'">{{ item.value }}</label>

        <!-- Text -->
        <input class="vue-qz-tray--form-element--input vue-qz-tray--input-text"
                type="text"
                :id="'vue-qz-tray-options-' + index"
                :name="'vue-qz-tray-options-' + index"
                v-model="item.value"
                v-else-if="item.type === 'text'" />

        <!-- Number -->
        <input class="vue-qz-tray--form-element--input vue-qz-tray--input-number"
                type="number"
                :id="'vue-qz-tray-options-' + index"
                :name="'vue-qz-tray-options-' + index"
                v-model="item.value"
                v-else-if="item.type === 'number'" />

        <!-- Checkbox -->
        <input class="vue-qz-tray--form-element--input vue-qz-tray--input-checkbox"
                type="checkbox"
                :id="'vue-qz-tray-options-' + index"
                :name="'vue-qz-tray-options-' + index"
                v-model="item.value"
                v-else-if="item.type === 'checkbox'" />

        <!-- Select -->
        <select class="vue-qz-tray--form-element--input vue-qz-tray--input-select"
                :id="'vue-qz-tray-options-' + index"
                :name="'vue-qz-tray-options-' + index"
                v-model="item.value"
                v-else-if="item.type === 'select'">
            <option v-if="item.value === null"
                    value=""
                    v-once
                    disabled>Please select one
            </option>
            <option v-for="(optionLabel, option) in item.options"
                    :key="option"
                    class="vue-qz-tray--input-select-option"
                    :value="option">
                {{ optionLabel }}
            </option>
        </select>

        <!-- Object -->
        <vue-qz-tray-form-nested
                class="vue-qz-tray--form-element--input vue-qz-tray--input-object"
                :items="item.value"
                v-else-if="item.type === 'object'"></vue-qz-tray-form-nested>

        <!-- Value -->
        <span class="vue-qz-tray--form-element--input vue-qz-tray--input-value"
                :id="'vue-qz-tray-options-' + index"
                :name="'vue-qz-tray-options-' + index"
                v-else>{{ item.value }}</span>
    </div>
</template>

<script>
    export default {
        name: 'VueQzTrayFormElement',

        components: {
            VueQzTrayFormNested: () => import('./vue-qz-tray-form-nested.vue')
        },

        props: {
            index: String,
            item: Object
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--form-element {
        display: block;
        position: relative;

        width: 100%;

        margin: 0;
        padding: 0;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        .vue-qz-tray--form-element--input {
            display: block;
            position: relative;

            width: 100%;

            margin: 0;

            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            &.vue-qz-tray--input-label {
                margin: 0;

                font-size: .8em;
                font-weight: 600;
                line-height: 1.484374;
                cursor: text;

                border: 0 none;
                border-top: 1px solid transparent; // Height hack - label gets input height
            }

            &.vue-qz-tray--input-object {
                margin-top: 0;
                margin-bottom: 0;

                &::v-deep .vue-qz-tray--form-nested--table-row:first-child {
                    border-top: 0 none;

                    .vue-qz-tray--form-nested--table-cell {
                        padding-top: 0;
                    }
                }
            }
        }

    }
</style>
