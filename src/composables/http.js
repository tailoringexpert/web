import { toValue } from 'vue';
import { getToken, useKeycloak } from '@josempgon/vue-keycloak'
import api from '@/plugins/api';

export function useHttp() {
    const download = (url) => {
        const _url = toValue(url);

        if (_url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            return api
                .get(_url, { responseType: 'arraybuffer' })
                .then((response) => {
                    provide(response);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error(error.data));
                });
        });
    };

    const provide = (response) => {
        const link = document.createElement('a');
        const name = response.headers.get('Content-Disposition').split('filename=')[1].replaceAll('"', '');
        const blob = new Blob([response.data], {
            type: response.headers.get('Content-Type')
        });
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const get = (path, file) => {
        const token = () => async (dispatch) => await getToken();
        const { decodedToken } = useKeycloak();

        const url = window.location.origin + path + '/' + toValue(decodedToken).tenant + '/' + file;
        if (url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            return api
                .get(url)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error.data);
                });
        });
    };

    return {
        download,
        provide,
        get
    };
}
