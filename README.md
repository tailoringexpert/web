# tailoringexpert-web

Frontend of Tailoringexpert plattform implemented using Vue and Vuetify.

## Build

Build of the artifact is realized running npm wrapper in maven build.
To create the deployable artefact of the module it is stronlgy recommeded to use
the maven install target because everything will be packed in an easy to deliver
and deploy zip artefact.

## Development

### npm
The module uses a npm maven wrapper.
If npm is installed on a system, it is also possible to use npm directly instead
of using the prepared maven executions.

#### Project setup

    npm install

#### Compiles and hot-reloads for development

    npm run serve

#### Compiles and minifies for production

npm run build

#### Lints and fixes files

    npm run lint


### maven
To start development server simply run
    
    mvn -DskipTests frontend:npm@npm-run-serve -P serve    

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


