import { reactive, toValue, readonly, toRef } from 'vue';
import axios from 'axios';

import { useHttp } from '@/composables/http';

export function useAttachmentsDialog() {
    const { download } = useHttp();

    const state = reactive({
        tailoring: null,
        attachments: []
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring)),
        attachments: (attachments) => (state.attachments = toRef(attachments))
    };

    const actions = {
        initialize: () => {
            const url = toValue(state.tailoring)._links.attachment.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .get(url)
                    .then((response) => {
                        mutations.attachments(response.data.hasOwnProperty('_embedded') ? response.data._embedded.files : []);
                        resolve(state.attachments);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        upload: (file) => {
            const url = toValue(state.tailoring)._links.attachment.href;
            if (url == null) {
                return Promise.resolve();
            }

            let data = new FormData();
            data.append('file', toValue(file));

            return new Promise((resolve, reject) => {
                return axios
                    .post(url, data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    .then(() => {
                        actions.initialize();
                        resolve(state.attachments);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        download: (attachment) => {
            const url = toValue(attachment)._links.self.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url);
        },
        delete: (attachment) => {
            const url = toValue(attachment)._links.self.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .delete(url)
                    .then(() => {
                        state.attachments.splice(state.attachments.indexOf(attachment), 1);
                        resolve(state.attachments);
                    })
                    .catch((error) => {
                        console.log(error);
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
