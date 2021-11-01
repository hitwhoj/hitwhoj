<template>
  <ul class="nav">
    <li><router-link to="/">Home</router-link></li>
    <li v-if="!user.username">
      <router-link to="/signin">Sign In</router-link>
    </li>
    <li v-if="!user.username">
      <router-link to="/signup">Sign Up</router-link>
    </li>
    <li v-if="user.username">
      <router-link to="/upload">Upload a file</router-link>
    </li>
    <li v-if="user.username">
      <router-link to="/files">My files</router-link>
    </li>
  </ul>
  <div class="content">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onServerPrefetch, toRefs } from "vue";
import { useStore } from "./store";

const store = useStore();

const fetchData = async () => {
  await store.dispatch("user/whoami");
};

onServerPrefetch(fetchData);
onMounted(() => {
  if (!store.state.user.files) {
    fetchData();
  }
});

store.commit("ssr/title", "Hello world");
store.commit("ssr/meta", {
  name: "description",
  content: "desc is not allowed in this page",
});

const { user } = toRefs(store.state);
</script>

<style lang="less">
body,
html {
  padding: 0;
  margin: 0;
}
</style>

<style lang="less" scoped>
.nav {
  width: 80%;
  text-align: center;
  margin: 0 auto;

  .nav {
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;

    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.9);
      padding: 10px 20px;
      height: 50px;
      line-height: 50px;
      background: rgba(0, 0, 0, 0.1);
      transition: background 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.content {
  text-align: center;
}
</style>
