<template>
    <v-dialog v-model="active" width="auto">
        <v-card
            max-width="400"
            prepend-icon="mdi-update"
            text="Your application will relaunch automatically after the update is complete."
            title="Update in progress"
        >
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field
                            v-model="tailoring.name"
                            label="Edit"
                            single-line
                            counter
                            autofocus
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
                <!-- <template v-slot:input>
                                    <v-text-field
                                        v-model="item.name"
                                        label="Edit"
                                        single-line
                                        counter
                                        autofocus
                                    >
                                    </v-text-field>
                                </template> -->
            </v-card-text>
            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Cancel"
                    @click="onCancel()"
                ></v-btn>
                <v-btn
                    class="ms-auto"
                    text="Ok"
                    @click="onSave()"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, reactive, defineExpose } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

export default {
    name: "NameDialog",

    setup() {

        const wait = ref(false);
        const active = ref(false);

        const tailoring = reactive(null);
        
        function onActivate(_tailoring) {
            this.wait = true;
            console.log(tailoring);

            this.tailoring = tailoring;
            this.active = true;
        }

        function onCancel() {
            console.log("onCancel");
        }

        function onSave() {
            console.log("onSave");
        }



        defineExpose({
            onActivate,
        });

        return {
            wait,
            active,
            onActivate,
            onCancel,
            onSave
        }

    },
}
</script>
