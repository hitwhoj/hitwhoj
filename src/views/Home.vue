<template>
  <div v-if="profile">
    <h1>
      <translate text="greeting" :args="[profile._id]" />
    </h1>
    <p>
      <translate text="your_email" />
      <a :href="'mailto:' + profile.email">{{ profile.email }}</a>
    </p>
  </div>
  <div v-else>
    <h1>
      <translate text="welcome" />
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../store";

const store = useStore();

const profile = computed(() => store.state.user.profile);
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
