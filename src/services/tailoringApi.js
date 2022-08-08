export default {
    getLinks(origin) {
        Vue.http.get(origin).then(
            response => {
                return response.body._links;
            },
            response => {
                console.log(response);
            }
        );
    }
};