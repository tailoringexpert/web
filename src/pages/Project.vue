<template src="@/pages/Project/index.template.html" />
<!-- <template>
<ScreeningsheetDialog :link="screeningsheetLink" />    
</template> -->


<script>
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import axios from "axios";

import ScreeningsheetDialog from "./Project/ScreeningsheetDialog"
import SelectionvectorDialog from "./Project/SelectionvectorDialog"
import CompareDialog from "./Project/CompareDialog"
import DocumentsDialog from "./Project/DocumentsDialog.vue"

export default {
    name: "Project",
    components: {
        ScreeningsheetDialog,
        SelectionvectorDialog,
        CompareDialog,
        DocumentsDialog
    },

    setup() {
        const { t } = useI18n();

        const wait = ref(false);
        const snack = ref(false);
        const snackText = ref("");


        const headers = reactive([
            {
                title: t("name"),
                align: "start",
                sortable: true,
                value: "name",
            },
            {
                title: t("phase", 2),
                sortable: true,
                value: "phases",
            },
            {
                title: t("state"),
                sortable: true,
                value: "state",
            },
            {
                title: t("catalog"),
                sortable: true,
                value: "catalogVersion",
            },
            {
                title: t("action", 2),
                value: "actions",
                sortable: false,
            },
        ]);

        const isScreeningsheetOpen = ref(false);
        const screeningsheetLink = ref("");

        const project = reactive({
            name: null,
            tailorings: [],
            _links: [],
        });

        // store.commit("selectionVectorParameterTranslations", i18n.t("tenants")[Vue.storage.get('tenant')]['selectionvector']);

        const store = useStore();
        const svpt = (code) =>
            t("tenants." + store.state.tenant + ".selectionvector." + code);

        function isTailoringEditable(item) {
            return "CREATED" == item.state;
        }

        function isTailoringDeletable(item) {
            return "CREATED" == item.state;
        }

        function onOpenScreeningSheet(link) {
            isScreeningsheetOpen.value = true;
            this.$refs.screeningsheet.onActivate(link);
        }

        function onOpenSelectionVector(link) {
            this.$refs.selectionvector.onActivate(link);
        }

        function onTailoringCompare(link) {
            this.$refs.compare.onActivate(link);
        }


        function onDocuments(item) {
            this.$refs.documents.onActivate(item._links.signature.href);
        }
        return {
            wait,
            snack,
            snackText,
            svpt,
            headers,
            project,
            isTailoringEditable,
            isTailoringDeletable,
            isScreeningsheetOpen,
            onOpenScreeningSheet,
            onOpenSelectionVector,
            onTailoringCompare,
            onDocuments,
            screeningsheetLink,
        };
    },

    created() {
        this.wait = true;

        this.$store.commit("breadcrumbs", [
            {
                text: this.$t("project", 2),
                disabled: false,
                exact: true,
                to: { name: "projects" },
            },
            {
                text: this.$route.params.id,
                disabled: false,
                exact: true,
                to: { name: "project", params: { id: this.$route.params.id } },
            },
        ]);

        axios
            .get(this.$store.state.project)
            .then((response) => {
                this.project = response.data;
                console.log(this.project)
                this.wait = false;
            })
            .catch(() => {
                this.wait = false;
            });
    },
};
</script>
