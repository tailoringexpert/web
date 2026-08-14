import store from '@/plugins/store';
import { getToken, useKeycloak } from '@josempgon/vue-keycloak';
import axios from 'axios';
import { toValue } from 'vue';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

const { decodedToken } = useKeycloak()

// Request interceptor for API calls
instance.interceptors.request.use(
  async config => {
    if (!config.headers['X-Skip-Loading']) {
        store.mutations.loading(true);
    } else {
        delete config.headers['X-Skip-Loading'];
    }

    const token = await getToken()
    config.headers['Authorization'] = `Bearer ${token}`
    config.headers['X-TENANT'] = toValue(decodedToken).tenant;

    return config
  },
  error => {
        setTimeout((error) =>  store.mutations.loading(false), 10);
            return Promise.reject(new Error(error));
  },
)

instance.interceptors.response.use(
    (response) => {
        store.mutations.loading(false);
        return response;
    },
    async (error) => {
        store.mutations.loading(false);
        return Promise.reject(new Error(error));
    }
);

export default instance;
