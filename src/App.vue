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
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <v-breadcrumbs :items="$store.state.breadcrumbs">
                </v-breadcrumbs>

                <router-view></router-view>

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
        var origin = window.location.origin + "/help/" + this.$route.name + ".html";
        //window.open(origin);
        //window.location = origin;
        //location.replace(origin);

        this.$http.get(origin).then(
            response => {
                console.log(response.body);
                this.helpText = response.body;
                this.help = true;
            }
        );

    }
  }

}
</script>
