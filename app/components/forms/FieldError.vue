<script setup lang="ts">
const props = defineProps<{
  message: string | string[] | undefined;
}>();

const displayMessage = computed(() => {
  if (props.message) {
    if (typeof props.message === "string") {
      return props.message;
    } else {
      return props.message[0];
    }
  }

  return "";
});
</script>

<template>
  <Message severity="error" size="small" variant="simple">
    {{ displayMessage }}
  </Message>
</template>
