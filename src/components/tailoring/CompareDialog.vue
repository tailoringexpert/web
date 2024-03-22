<template>
  <v-overlay v-model="wait">
    <v-progress-circular
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script>
import { ref, reactive, defineExpose } from "vue";
import axios from "axios";

export default {
    name: "CompareDialog",

    setup() {
        const tailoring = reactive({});

        const wait = ref(false);

        function onActivate(_tailoring) {
            this.wait = true;

            Object.assign(tailoring, _tailoring);

            axios
                .get(tailoring._links.compare.href, { responseType: "arraybuffer" })
                .then((response) => {
                    const link = document.createElement("a");
                    const blob = new Blob([response.data], {
                        type: response.headers.get("Content-Type"),
                    });
                    link.href = URL.createObjectURL(blob);
                    link.download = response.headers
                        .get("Content-Disposition")
                        .split("filename=")[1];
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                })
                .catch(() => {
                    this.wait = false;
                });
        }

        defineExpose({
            onActivate,
        });

        return {
            wait,
            onActivate,
        };
    },
};
</script>

<style scoped></style>
