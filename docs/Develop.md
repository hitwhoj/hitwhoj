# Develop

Development tools should be your powerful helpers, but not spend a whole day on making your Webpack to build your Vue SFC code without errors.

So we solved most of the problems you might face to on building your web apps, and provided some effective solutions to some really frustrated and hair-falling problems.

It is better for you to have a read of this articles before you start to modify our code.

## Server Side Rendering

Server side rendering is a major problem in full-stack projects. The most complicated part is how we fetch user's data on server and preventing it to be fetched twice on client.

Vue.js has given an official solution for [Data Pre-Fetching and State](https://ssr.vuejs.org/guide/data.html). We followed this solution and you can see it in `src/components/Files.vue`.

```ts
const files = computed(() => store.state.user.files);

const fetchData = async () => {
  await store.dispatch("user/files");
};

onServerPrefetch(fetchData);
onMounted(() => {
  if (!files.value) {
    fetchData();
  }
});
onUnmounted(() => {
  store.commit("user/set_files", null);
});
```

Note that we defined `fetchData` to fetch all the data we need to render this page.

The default value of `files.value` (`store.state.user.files`) is `null`, and we will fetch the data iff `files.value === null`. If server has rendered already, then the default value of `files.value` will not be `null`, thus we can prevent client to fetch the data twice. Also, `files.value` will be reset to `null` if we leave the page in order to refetch data next time we enter the page.
