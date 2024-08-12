import { toValue } from "vue";
import axios from "axios";

export function useHttp() {
    const download = (url) => {
        var _url = toValue(url);

        if (_url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            return axios
                .get(_url, { responseType: "arraybuffer" })
                .then((response) => {
                    provide(response);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error.data);
                });
        });
    };

    const provide = (response) => {
        const link = document.createElement("a");
        const name = response.headers
            .get("Content-Disposition")
            .split("filename=")[1]
            .replaceAll('"', "");
        const blob = new Blob([response.data], {
            type: response.headers.get("Content-Type"),
        });
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return {
        download,
        provide,
    };
}
