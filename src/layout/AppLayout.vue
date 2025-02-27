<script setup>
import { useRoute } from "vue-router";
import { useLayout } from '@/layout/composables/layout';
import { inject, computed, ref, reactive, watch } from 'vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';

import { useHttp } from '@/composables/http.js';
import sanitizeHtml from 'sanitize-html';

const store = inject('store');
const blocked = computed(() => store.state.loading);
const { t } = useI18n();
const confirm = useConfirm();

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}


const route = useRoute();
const { get } = useHttp();
const help = reactive({
    state: false,
    text: null
});

const onHelp = (event) => {
    onOpen("help/" + route.name + ".html");
}

const onOpen = (payload) => {
    get("/static", payload)
        .then((response) => {
            help.title = route.name;
            help.text = response;
            help.state = true;
        })
        .catch((error) => {
            store.mutations.loading(false);
        });
}

const webVersion = computed(() => WEB_VERSION);
const onAbout = () => {
    confirm.require({
        header: "About",
        message: webVersion,
        rejectProps: {
            style: 'visibility:hidden'
        },
        acceptProps: {
            label: t('ok'),
            severity: 'secondary'
        }
    });
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar @help="onHelp" @open="onOpen"/>
        <app-sidebar @help="onHelp" @about="onAbout"/>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
        </div>
        <app-footer @open="onOpen"></app-footer>
    </div>

    <BlockUI :blocked="blocked" full-screen>
        <ProgressSpinner v-if="blocked" fill="transparent" style="position: fixed; top: 50%; left: 50%; z-index: 10000" />
    </BlockUI>

    <ConfirmDialog />
    <Toast />

    <Drawer v-model:visible="help.state" position="bottom" style="height: auto">
        <p v-html="help.text"></p>
    </Drawer>
</template>
