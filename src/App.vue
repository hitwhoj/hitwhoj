<template>
  <ul class="nav">
    <li>
      <router-link to="/">
        <translate text="home" />
      </router-link>
    </li>
    <li v-if="!username">
      <router-link to="/signin">
        <translate text="sign_in" />
      </router-link>
    </li>
    <li v-if="!username">
      <router-link to="/signup">
        <translate text="sign_up" />
      </router-link>
    </li>
    <li v-if="username">
      <router-link to="/upload">
        <translate text="upload_file" />
      </router-link>
    </li>
    <li v-if="username">
      <router-link to="/files">
        <translate text="my_files" />
      </router-link>
    </li>
  </ul>
  <div class="content">
    <router-view />
  </div>
  <div class="content">
    <button @click="changeLang('en_us')">English</button>
    <button @click="changeLang('zh_cn')">中文</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onServerPrefetch } from "vue";
import { Languages } from "./plugins/i18n/lang";
import { useStore } from "./store";

const store = useStore();

const fetchData = async () => {
  await store.dispatch("user/whoami");
};

const username = computed(() => store.getters.username);

onServerPrefetch(fetchData);
onMounted(() => {
  if (!username.value) {
    fetchData();
  }
});

store.commit("ssr/title", "Hello world");
store.commit("ssr/meta", {
  name: "description",
  content: "This is an example description",
});

const changeLang = async (lang: Languages) => {
  await store.dispatch("i18n/change_language", lang);
};
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
