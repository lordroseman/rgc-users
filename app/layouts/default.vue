<script lang="ts" setup>
const appStore = useAppStore();
</script>


<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900">
    <AppTopbar />  
    <AppSidebar />
    <main 
      class="mt-[60px] transition-all duration-300  h-full min-h-[calc(100vh-4rem)]"
      :class="{
        'md:ml-64': !appStore.sidebarOpen,
        'md:ml-0': appStore.sidebarOpen,
      }">
      <slot />
    </main>
  </div>
</template>