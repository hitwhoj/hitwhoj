<template>
  <h1>
    <translate text="not_found_404" />
  </h1>
</template>

<script lang="ts" setup>
import { useStore } from "../store";

const store = useStore();

store.commit("ssr/status", 404);
store.commit("ssr/title", "404 NOT FOUND");
store.commit("ssr/meta", {
  name: "description",
  content: "This page was not found on site.",
});
</script>
