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
            var url = toValue(state.tailoring)._links.attachment.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .get(url)
                    .then((response) => {
                        mutations.attachments(response.data.hasOwnProperty('_embedded') ? response.data._embedded.files : []);

                        /*                 if (response.data.hasOwnProperty("_embedded")) {
                            mutations.attachments(
                                response.data._embedded.files
                            );

                        } else {

                        } */
                        console.log('b');
                        resolve(state.attachments);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        upload: (attachment) => {
            var url = toValue(state.tailoring)._links.attachment.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .post(url, attachment, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    .then(() => {
                        actions.initialize();
                        resolve(state.attachments);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        download: (attachment) => {
            var url = toValue(attachment)._links.self.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url);
        },
        delete: (attachment) => {
            var url = toValue(attachment)._links.self.href;
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
