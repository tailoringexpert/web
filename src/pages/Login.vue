<script setup>
import { ref, inject, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import router from '@/plugins/router';
import { useLogin } from '@/composables/Login';

const store = inject('store');

// internal
const { actions } = useLogin();
const { t } = useI18n();
const toast = useToast();
const blocked = computed(() => store.state.loading);

const userId = ref(null);
const password = ref(null);

const onLogin = () => {
    actions
        .login(userId, password)
        .then((response) => {
            store.mutations.loading(false);
            router.push({
                name: store.state.returnUrl
            });
        })
        .catch((response) => {
            store.mutations.loading(false);
            toast.add({
                severity: 'error',
                summary: t('Login.login.title'),
                detail: t('Login.login.error'),
                life: 3000
            });
        });
};
</script>

<template>
    <Toast />

    <BlockUI :blocked="blocked" full-screen>
        <ProgressSpinner v-if="blocked" fill="transparent" style="position: fixed; top: 50%; left: 50%; z-index: 10000" />
    </BlockUI>

    <div class="fixed flex gap-4 top-8 right-8"></div>

    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div style="display: flex; justify-content: center">
                            <img alt="TailoringeXpert logo" src="/logo.png" x="0" y="0" width="54" height="40" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                            {{ t('tenant.Login.title') }}
                        </div>
                        <span class="text-muted-color font-medium">
                            {{ $t('tenant.Login.subTitle') }}
                        </span>
                    </div>

                    <div>
                        <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2" for="userId">{{ t('tenant.Login.username') }} </label>
                        <InputText id="userId" v-model="userId" type="text" :placeholder="t('tenant.Login.username_placeholder')" class="w-full md:w-[30rem] mb-8" />

                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ t('tenant.Login.password') }} </label>
                        <Password id="password" v-model="password" :placeholder="t('tenant.Login.password_placeholder')" :toggle-mask="true" class="mb-4" fluid :feedback="false" @keyup.enter="onLogin" />

                        <Button :label="t('tenant.Login.login')" class="w-full" @click="onLogin" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
