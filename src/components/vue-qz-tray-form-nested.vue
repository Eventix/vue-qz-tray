<template>
    <div class="vue-qz-tray--form-nested">
        <table class="vue-qz-tray--form-nested--table">
            <tbody>
            <tr class="vue-qz-tray--form-nested--table-row"
                    v-for="(item, index) in items"
                    v-show="!item.hidden"
                    :key="index">
                <th class="vue-qz-tray--form-nested--table-cell vue-qz-tray--form-nested--table-cell--label">
                    <slot name="label"
                            :item="item"
                            :index="index">
                        <vue-qz-tray-form-element
                                :item="{value: item.label, type: 'label'}"
                                :index="index"></vue-qz-tray-form-element>
                    </slot>
                </th>

                <td class="vue-qz-tray--form-nested--table-cell">
                    <div class="vue-qz-tray--form-nested--input">
                        <slot :name="item.type"
                                :item="item"
                                :index="index">
                            <vue-qz-tray-form-element
                                    :item="item"
                                    :index="index"></vue-qz-tray-form-element>
                        </slot>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'VueQzTrayFormNested',

        components: {
            VueQzTrayFormElement: () => import('./vue-qz-tray-form-element')
        },

        props: {
            items: Object
        }
    };
</script>

<style lang="less" scoped>
    .vue-qz-tray--form-nested {
        display: block;
        position: relative;

        width: 100%;

        margin: 0;
        padding: 0;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        .vue-qz-tray--form-nested--table {
            display: table;

            width: 100%;

            border-collapse: collapse;

            .vue-qz-tray--form-nested--table-row {
                border-top: 1px solid #d3d3d3;

                &:first-child {
                    border-top: 0 none;
                }
            }

            .vue-qz-tray--form-nested--table-cell {
                display: table-cell;

                padding: 6px 0;
            }

            th.vue-qz-tray--form-nested--table-cell {
                text-align: left;
                vertical-align: top;
            }
        }
    }
</style>
