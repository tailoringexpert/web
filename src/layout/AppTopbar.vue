<script setup>
import { inject, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useKeycloak } from '@josempgon/vue-keycloak';
import AppConfigurator from '@/layout/AppConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';
import Breadcrumb from 'primevue/breadcrumb';

const emit = defineEmits(['help', 'login', 'logout']);

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const store = inject('store');
const { t } = useI18n();
const home = ref({
    icon: 'pi pi-home',
    route: '/'
});

const { isAuthenticated, username, keycloak } = useKeycloak();

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars" />
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img alt="dropdown icon" src="/logo.png" x="0" y="0" width="54" height="40" />
                <span>TailoringeXpert</span>
            </router-link>
        </div>

        <Breadcrumb :home="home" :model="store.state.breadcrumbs">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]" />
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette" />
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                class="layout-topbar-menu-button layout-topbar-action"
            >
                <i class="pi pi-ellipsis-v" />
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <Select v-model="$i18n.locale" :options="$i18n.availableLocales"> </Select>
                    <button type="button" class="layout-topbar-action" @click="emit('help')">
                        <i class="pi pi-question" />
                    </button>
                    <Button icon="pi pi-sign-out" rounded outlined  @click="keycloak.logout()"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
