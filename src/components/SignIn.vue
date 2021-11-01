<template>
  <div class="signin">
    <input type="text" v-model="username" />
    <input type="password" v-model="password" />
    <input type="button" @click="submit" value="sign in" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";

const store = useStore();
const router = useRouter();

const username = ref("");
const password = ref("");

async function submit() {
  const success = await store.dispatch("user/signin", {
    username: username.value,
    password: password.value,
  });

  if (success) {
    router.push("/");
  }
}
</script>

<style lang="less" scoped>
.signin {
  width: 200px;
  margin: 100px auto;
}
</style>
