<script setup lang="ts">
const auth = useAuthStore();
const goHome = () => navigateTo('https://login.ribshack.test', { external: true });

definePageMeta({
  layout: 'auth'
});
</script>

<template>
  <NuxtLayout name="auth">
    <section class="flex flex-col items-center justify-center gap-6 px-6">
      <div class="text-center max-w-xl">
  <i class="pi pi-lock text-primary-400" style="font-size:72px" />
        <h1 class="mt-4 text-3xl font-bold">403 — Forbidden</h1>
        <p class="mt-2 text-gray-300">
          You don’t have permission to access this app. If you think this is a mistake, contact your administrator.
        </p>
      </div>

      <div class="flex gap-3">
        <Button label="Go Home" icon="pi pi-home" severity="secondary" @click="goHome" />
        <Button label="Logout" icon="pi pi-sign-out" @click="auth.logout" />
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
section { min-height: 100vh; }
</style>
