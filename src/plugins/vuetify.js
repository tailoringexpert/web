// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import colors, { blue } from 'vuetify/util/colors'
import { md3 } from 'vuetify/blueprints'

const vuetify = createVuetify({
  components,  
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  blueprint: md3,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.lightBlue.darken4,
          secondary: colors.grey.darken1 
        }
      },
    },
},
});

export default vuetify;
