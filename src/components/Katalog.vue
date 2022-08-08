<template src='./Katalog/index.template.html'></template>

<style scoped>
@import './Katalog/index.css';
</style>

<script>
import { data } from "./Katalog/index.js";

export default {
  mixins: [data],
}
</script>