<template>
    <v-app>
        <v-app-bar app>
            <router-link to="/project">
                <v-img src="logo.png" max-width="36" max-heigt="36" ></v-img>
            </router-link>
            <v-spacer></v-spacer>
            <v-toolbar-title>TailoringExpert | Tailoring</v-toolbar-title>
            <v-btn class="mx-2" fab dark small color="grey lighten-2" @click="openHelp()">
                <v-icon dark>mdi-help</v-icon>
            </v-btn>

            <v-menu left bottom rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/project">
                        Projects
                    </v-list-item>
                    <v-list-item to="/catalog">
                        Catalogs
                    </v-list-item>
                </v-list>
            </v-menu>

        </v-app-bar>

        <v-main>
            <v-container fluid>

                <router-view></router-view>

                <v-btn plain @click="openImpressum()">Impressum</v-btn>
                <v-btn plain @click="openDataProtection()">Data Protection</v-btn>

                <v-bottom-sheet v-model="help">
                    <v-card class="overflow-y-auto" max-height="400">
                        <v-banner class="justify-end headline font-weight-light" sticky>
                            <v-icon @click="help=false">mdi-close-circle-outline</v-icon>
                        </v-banner>

                        <v-card-text>
                            <div class="mb-4" v-html="helpText"></div>
                        </v-card-text>
                    </v-card>
                </v-bottom-sheet>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { useRouter, useRoute } from "vue-router"

export default {
  data: () => (
    {
        help: false,
        helpText: '',
        footer: {
            inset: false,
        },
    }
  ),
  methods: {
    openHelp : function() {
        const route = useRoute()

        // Will return the route name
        console.log(route.name)
        this.loadHTML("/static", "help/" + route.name + ".html");
    },
    openImpressum: function() {
        this.loadHTML("/static", "impressum.html");
    },
    openDataProtection: function() {
        this.loadHTML("/static", "dataprotection.html");
    },
    loadHTML : function(path, file) {
        axios
            .get(window.location.origin + path + "/demo/" + file)
            .then(response => {
                  this.helpText = response.data;
                  this.help = true;
            })
            .catch(error => {
                console.log(error);
            });
    },
  }

}
</script>
