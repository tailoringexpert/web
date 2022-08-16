<template>
    <v-app>
        <v-app-bar app>
                <router-link to="/project">
                    <v-img src="logo.png" max-width="36" max-heigt="36" ></v-img>
                </router-link>
                <v-spacer></v-spacer>
                <v-toolbar-title>TailoringExpert | Tailoring</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container fluid>
                <v-breadcrumbs :items="$store.state.breadcrumbs">
                </v-breadcrumbs>

                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
  data: () => (
    {
        footer: {
            inset: false,
        },
    }
  ),

}
</script>
