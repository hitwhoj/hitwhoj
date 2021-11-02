<template>
  {{ translatedText }}
</template>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { useStore } from "../../store";
import { TranslateKeys } from "./lang";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  args: {
    type: Array,
    required: false,
  },
});

const store = useStore();

const translation = computed(() => store.state.i18n.translation);
const key = computed(() => props.text);
const args = computed(() =>
  Array.isArray(props.args) ? props.args.map(String) : []
);

const translatedText = computed(() => {
  const k = key.value;
  const t = translation.value;
  const v = t[k as TranslateKeys];
  if (!v) {
    console.warn(`Translation for ${k} was not found`);
    return "???";
  }
  return v.replace(/\{(\d+)\}/g, (_, i) => args.value[i]);
});
</script>
