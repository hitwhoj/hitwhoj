<template>
  <div v-if="user.username">
    <h1>Hello {{ user.username }}!</h1>
    <p>
      And you email is <a :href="'mailto:' + user.email">{{ user.email }}</a>
    </p>
  </div>
  <div v-else>
    <h1>Who are you, idiot?</h1>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { useStore } from "../store";

const store = useStore();

const { user } = toRefs(store.state);
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
