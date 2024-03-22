<template src="@/pages/Project/index.template.html" />
<!-- <template>
<ScreeningsheetDialog :link="screeningsheetLink" />    
</template> -->


<script>
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute  } from "vue-router"
import axios from "axios";
import store from "@/store";

import ScreeningsheetDialog from "@/components/screeningsheet/ScreeningsheetDialog"
import SelectionvectorDialog from "@/components/tailoring/SelectionvectorDialog"
import CompareDialog from "@/components/tailoring/CompareDialog"
import DocumentsDialog from "@/components/tailoring/DocumentsDialog"
import AttachmentsDialog from "@/components/tailoring/AttachmentsDialog"

export default {
    name: "Project",
    components: {
        ScreeningsheetDialog,
        SelectionvectorDialog,
        CompareDialog,
        DocumentsDialog,
        AttachmentsDialog
    },

    setup() {
        const { t } = useI18n();

        const wait = ref(false);
        const snack = ref(false);
        const snackText = ref("");
        const tailoring = reactive(null);


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

        const svpt = (code) =>
            t("tenants." + store.state.tenant + ".selectionvector." + code);

        function isTailoringEditable(item) {
            return "CREATED" == item.state;
        }

        function isTailoringDeletable(item) {
            return "CREATED" == item.state;
        }

        function onOpenScreeningSheet(item) {
            console.log("onOpenScreeningSheet");
            isScreeningsheetOpen.value = true;
            console.log(item);
            this.$refs.screeningsheet.onActivate(item);
        }

        function onOpenSelectionVector(item) {
             this.$refs.selectionvector.onActivate(item);
        }

        function onTailoringCompare(item) {
            this.$refs.compare.onActivate(item);
        }


        function onDocuments(item) {
            this.$refs.documents.onActivate(item._links);
        }

        function onAttachments(item) {
            this.$refs.attachments.onActivate(item._links);
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
            onAttachments,
            screeningsheetLink,
            tailoring
        };
    },

    created() {
        this.wait = true;

        const route = useRoute();
        const { t } = useI18n();

        
        store.commit("breadcrumbs", [
            {
                title: t("project", 2),
                disabled: false,
                exact: true,
                to: { name: "projects" },
            },
            {
                title: route.params.id,
                disabled: false,
                exact: true,
                to: { name: "project", params: { id: route.params.id } },
            },
        ]);

        axios
            .get(store.state.project)
            .then((response) => {
                this.project = response.data;
                this.wait = false;
            })
            .catch(() => {
                this.wait = false;
            });
    },
};
</script>
