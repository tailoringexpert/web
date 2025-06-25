import { toValue } from 'vue';
import axios from 'axios';
import store from '@/plugins/store';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
});

instance.interceptors.request.use(
    (config) => {
        store.mutations.loading(true);
        return config;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error)
    }
);
instance.interceptors.response.use(
    (response) => {
        setTimeout((response) => {
            store.mutations.loading(false);
        }, 10);
        return response;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error);
    }
);

instance.defaults.headers.common['X-TENANT'] = store.state.tenant;
instance.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
instance.interceptors.request.use(
    (config) => {
        store.mutations.loading(true);
        return config;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error)
    }
);
instance.interceptors.response.use(
    (response) => {
        setTimeout((response) => {
            store.mutations.loading(false);
        }, 10);
        return response;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error);
    }
);

export default instance;
