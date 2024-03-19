<template>
    <v-overlay v-model="wait">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="active" max-width="75%">
        <v-card elevation="2">
            <v-card-title>{{ $t("selectionvector_applied") }}</v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="selectionVectorParameter"
                    class="elevation-1"
                >
                </v-data-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined rounded text @click="active = false">{{
                    $t("close")
                }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, reactive, defineExpose } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import store from "@/store";

export default {
    name: "SelectionvectorDialog",

    setup() {
        const { t } = useI18n();

        const wait = ref(false);
        const active = ref(false);

        const headers = reactive([
            {
                title: t("name"),
                sortable: true,
                value: "label",
            },
            {
                title: t("value"),
                sortable: true,
                value: "value",
            },
        ]);

        const selectionVectorParameter = reactive([]);

        function onActivate(link) {
            this.wait = true;

            const parameterTranslation = (code) =>
                t("tenants." + store.state.tenant + ".selectionvector." + code);

            axios
                .get(link)
                .then((response) => {
                    var selectionVector = response.data;

                    this.selectionVectorParameter = [];
                    for (var name in selectionVector.levels) {
                        this.selectionVectorParameter.push({
                            label: parameterTranslation(name),
                            name: name,
                            value: selectionVector.levels[name],
                        });
                    }
                    this.selectionVectorParameter.sort((a, b) =>
                        a.label > b.label ? 1 : -1
                    );

                    this.wait = false;
                    this.active = true;
                })
                .catch((error) => {
                    console.log(error);
                    this.wait = false;
                });
        }

        defineExpose({
            onActivate,
        });

        return {
            onActivate,
            wait,
            active,
            headers,
            selectionVectorParameter
        };
    },
};
</script>

<style scoped></style>
