import { vueKeycloak } from '@josempgon/vue-keycloak'

export async function idm(app) {
    await vueKeycloak.install(app, {
        config: {
            url: window?.configs?.[IDM_URL] || IDM_URL,
            realm: window?.configs?.[IDM_REALM] || IDM_REALM,
            clientId: window?.configs?.[IDM_CLIENT] || IDM_CLIENT
       }
    });
};
