<template>
  {{ translate(lang, key, args) }}
</template>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { useStore } from "../../store";
import { translate } from "./lang";

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

const lang = computed(() => store.state.i18n.lang);
const key = computed(() => props.text);
const args = computed(() => (Array.isArray(props.args) ? props.args : []));
</script>
