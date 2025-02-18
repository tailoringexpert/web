<script setup>
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { mdiDotsVertical, mdiHelp } from "@mdi/js";

import Help from "@/components/help/Help";

// provided interfaces

// injects
const store = inject("store");
const logger = inject("logger");

const help = ref(false);
const helpText = ref("");

const route = useRoute();

const onHelp = () => {
    loadHTML("/static", "help/" + route.name + ".html");
};

const onImpressum = () => {
    loadHTML("/static", "impressum.html");
};

const onDataProtection = () => {
    loadHTML("/static", "dataprotection.html");
};

function loadHTML(path, file) {
    axios
        .get(
            window.location.origin +
                path +
                "/" +
                store.state.tenant +
                "/" +
                file
        )
        .then((response) => {
            helpText.value = response.data;
            help.value = true;
        })
        .catch((error) => {
            logger.error(error);
        });
}
</script>

<template>
  <v-app>
    <v-app-bar class="app-bar">
      <router-link to="/project">
        <img
          src="logo.png"
          width="36px"
          height="36px"
          alt="Home"
        >
      </router-link>
      <v-toolbar-title>TailoringExpert | Tailoring</v-toolbar-title>

      <v-spacer />

      <v-btn
        variant="plain"
        @click="onImpressum()"
      >
        Impress
      </v-btn>
      <v-btn
        variant="plain"
        @click="onDataProtection()"
      >
        Data Protection
      </v-btn>

      <Help
        :html="helpText"
        :active="help"
        @close:closed="help = false"
      />

      <v-btn
        class="mx-2"
        color="grey-lighten-2"
        @click="onHelp()"
      >
        <v-icon :icon="mdiHelp" />
      </v-btn>


      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            v-bind="props"
          >
            <v-icon :icon="mdiDotsVertical" />
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

    <v-system-bar window>
      <v-breadcrumbs :items="store.state.breadcrumbs" />
      <v-spacer />
    </v-system-bar>

    <v-main>
      <v-container
        fluid
      >
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

