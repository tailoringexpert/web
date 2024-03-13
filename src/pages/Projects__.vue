<script setup>

const msg2 = "ajjl";
// functions
function log() {
  console.log(msg)
}
</script>

<template>
  <v-container fluid>
    <v-overlay :value="wait">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="projects"
          :items-per-page="20"
          class="elevation-1"
        >
          <template #top>
            <v-toolbar
              flat
              color="white"
            >
              <v-toolbar-title>{{ $tc('project', 2) }}</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="onNewProject()"
              >
                {{ $tc('project_new') }}
              </v-btn>
            </v-toolbar>
          </template>

          <template #header.state>
            <v-container>
              <v-select
                v-model="state"
                label="State"
                :items="['', 'ONGOING', 'COMPLETED']"
                dense
                light
              />
            </v-container>
          </template>


          <template #item.state="{ item }">
            <span @click="onProjectState(item)">{{ item.state }} <v-icon
              small
              class="mr-2"
            >mdi-pencil-box-outline</v-icon></span>
          </template>

          <template #item.actions="{ item }">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onEditProject(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>{{ $tc('tooltip.project_edit') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onDeleteProject(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>{{ $tc('tooltip.project_delete') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { data } from "./Projects/index.js";

export default {
  mixins: [data],
}

console.log(data);
</script>

