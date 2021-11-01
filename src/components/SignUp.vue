<template>
  <div class="signup">
    <input type="text" v-model="username" />
    <input type="password" v-model="password1" />
    <input type="password" v-model="password2" />
    <input type="email" v-model="email" />
    <button @click="submit">
      <translate text="sign_up" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";

const store = useStore();
const router = useRouter();

const username = ref("");
const password1 = ref("");
const password2 = ref("");
const email = ref("");

async function submit() {
  if (password1.value !== password2.value) {
    return;
  }

  const success = await store.dispatch("user/signup", {
    username: username.value,
    password: password1.value,
    email: email.value,
  });

  if (success) {
    router.push("/");
  } else {
    alert("sign up failed");
  }
}
</script>

<style lang="less" scoped>
.signup {
  width: 200px;
  margin: 100px auto;
}
</style>
