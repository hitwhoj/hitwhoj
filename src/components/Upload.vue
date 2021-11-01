<template>
  <input type="file" name="file" @change="change" />
  <input type="button" value="Upload" @click="upload" />
</template>

<script lang="ts" setup>
import { useStore } from "../store";
import { Ref, ref } from "vue";

const store = useStore();

const file: Ref<File | null> = ref(null);

const change = (e: any) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  file.value = files[0];
};

const upload = async () => {
  if (!file.value) return;
  console.log("uploading");
  const success = await store.dispatch("user/upload", file.value);
  if (success) {
    alert("upload success");
  } else {
    alert("failed");
  }
};
</script>
