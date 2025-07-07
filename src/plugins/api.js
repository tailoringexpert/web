import { toValue } from 'vue';
import axios from 'axios';
import store from '@/plugins/store';
import router from '@/plugins/router';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

instance.interceptors.request.use(
    (config) => {
        store.mutations.loading(true);
        config.headers['X-TENANT'] = store.state.tenant;
        const token = toValue(store.getters.accessToken);
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        setTimeout((response) => {
            store.mutations.loading(false);
        }, 10);
        return response;
    },
    async (error) => {
        store.mutations.loading(false);
        const originalConfig = error.config;
        if (originalConfig.url !== '/auth/login' && error.response) {
            if (error.response.status === 403 && !originalConfig._retry) {
                if (toValue(store.state.auth) == null) {
                    router.push({ name: 'login' });
                } else {
                    store.mutations.toast({
                        summary: 'Unauthenticated',
                        severity: 'error'
                    });
                }
            }

            // Access Token was expired
            if (error.response.status === 400 && !originalConfig._retry) {
                originalConfig._retry = true;

                const data = new FormData();
                data.append('userId', toValue(store.state.auth.userId));
                data.append('refreshToken', toValue(store.state.auth.refreshToken));
                try {
                    store.mutations.loading(true);
                    const response = await instance.post(store.state.auth.refresh.href, data, {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    });

                    store.mutations.accessToken(response.data.accessToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);

        return Promise.reject(error);
    }
);

export default instance;
