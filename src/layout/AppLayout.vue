<script setup>
import { useRoute, useRouter } from 'vue-router';
import { inject, computed, ref, reactive, watch } from 'vue';

import AppFooter from '@/layout/AppFooter.vue';
import AppSidebar from '@/layout/AppSidebar.vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import { useLayout } from '@/layout/composables/layout';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

import { useHttp } from '@/composables/http.js';
import sanitizeHtml from 'sanitize-html';

const store = inject('store');
const blocked = computed(() => store.state.loading);
const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();

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

watch(
    () => store.state.toast,
    (newValue, oldValue) => onWarn('title', newValue.summary),
    { deep: true }
);

const onError = (title, message) => {
    console.log('onError');
    confirm.require({
        header: title,
        message: message,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            style: 'visibility:hidden'
        },
        acceptProps: {
            label: t('ok'),
            severity: 'secondary'
        }
    });
};

const onWarn = (title, message) => {
    console.log('onWarn');
    toast.add({
        severity: 'warn',
        summary: title,
        detail: message,
        life: 3000
    });
};

const onSuccess = (title, message) => {
    console.log('onSuccess');
    toast.add({
        severity: 'success',
        summary: title,
        detail: message,
        life: 3000
    });
};

const route = useRoute();
const router = useRouter();
const { get } = useHttp();
const help = reactive({
    state: false,
    text: null
});

const onHelp = (event) => {
    onOpen('help/' + route.name + '.html');
};

const onOpen = (payload) => {
    get('/static', payload)
        .then((response) => {
            help.title = route.name;
            help.text = response;
            help.state = true;
        })
        .catch((error) => {
            store.mutations.loading(false);
        });
};

const onLogin = () => {
    console.log('onLogin');
    route.push({
        name: 'login'
    });
};

const webVersion = computed(() => WEB_VERSION);
const onAbout = () => {
    confirm.require({
        header: 'About',
        message: webVersion,
        rejectProps: {
            style: 'visibility:hidden'
        },
        acceptProps: {
            label: t('ok'),
            severity: 'secondary'
        }
    });
};
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar @help="onHelp" @open="onOpen" @logout="onLogout" @login="onLogin" />
        <app-sidebar @help="onHelp" @about="onAbout" />
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view @success="onSuccess" @error="onError" />
            </div>
        </div>
        <app-footer @open="onOpen" />
    </div>

    <BlockUI :blocked="blocked" full-screen>
        <ProgressSpinner v-if="blocked" fill="transparent" style="position: fixed; top: 50%; left: 50%; z-index: 10000" />
    </BlockUI>

    <ConfirmDialog />
    <Toast />

    <Drawer v-model:visible="help.state" position="bottom" style="height: auto">
        <p v-html="help.text" />
    </Drawer>
</template>
