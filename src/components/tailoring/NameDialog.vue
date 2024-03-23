<template>
    <v-dialog v-model="active" width="auto">
        <v-card
            max-width="400"
            prepend-icon="mdi-update"
            text="Your application will relaunch automatically after the update is complete."
            title="Update in progress"
        >
            <template v-slot:input>
                <v-text-field
                    v-model="item.name"
                    label="Edit"
                    single-line
                    counter
                    autofocus
                >
                </v-text-field>
            </template>
            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Cancel"
                ></v-btn>
                <v-btn
                    class="ms-auto"
                    text="Ok"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>

    <script>
        import { ref, reactive, defineExpose } from "vue";
        import { useI18n } from "vue-i18n";
        // import axios from "axios";

        export default {
            name: "NameDialog",

            setup() {
                const active = ref(false);
                const tailoring = reactive("")
              
                function onActivate(item) {
                    console.log("onActivate");
                    this.active = true;
                    this.tailoring.value = item;
                }

                defineExpose({
                    onActivate,
                });
                return {
                    onActivate,
                    active,
                };
            },
        };
    </script>

    <style scoped></style>
</template>
