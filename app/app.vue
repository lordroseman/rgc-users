<template>
  <NuxtLayout>
    <Toast />
    <ConfirmDialog />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
onMounted(async () => {
  // authStore.fetchLocalUser(); // you can remove this if not needed
  authStore.scheduleSilentRefresh();
});
</script>
