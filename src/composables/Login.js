import { reactive, readonly, toRef, toValue } from 'vue';
import api from '@/plugins/api';
import store from '@/plugins/store';

export function useLogin() {
    const state = reactive({});

    const mutations = {};

    const actions = {
        login: (userId, password) => {
            console.log(toValue(store).state.links);

            const url = toValue(store).state.links.login.href;
            if (url == null) {
                return Promise.resolve();
            }

            const data = new FormData();
            data.append('userId', toValue(userId));
            data.append('password', toValue(password));

            return new Promise((resolve, reject) => {
                return api
                    .post(url, data, {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    })
                    .then((response) => {
                        store.mutations.tenant(response.data.tenant);

                        const auth = {};
                        auth.userId = response.data.userId;
                        auth.accessToken = response.data.accessToken;
                        auth.refreshToken = response.data.refreshToken;
                        auth.refresh = response.data.links[0].href;
                        store.mutations.auth(auth);

                        resolve(store.state.auth);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
