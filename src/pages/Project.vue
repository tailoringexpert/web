<script setup>
import { defineProps } from 'vue'
const props = defineProps(['self'])

console.log("set" + props.self)
</script>


<template src="@/pages/Project/index.template.html" />
<script>
import { data } from "@/pages/Project/index.js";

export default data
</script>
