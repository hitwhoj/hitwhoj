<template>
  <h1>404 NOT FOUND</h1>
</template>

<script lang="ts" setup>
import { useStore } from "../store";

const store = useStore();

store.commit("ssr/status", 404);
store.commit("ssr/title", "404 NOT FOUND");
</script>
