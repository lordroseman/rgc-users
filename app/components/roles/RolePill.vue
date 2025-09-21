<script setup lang="ts">
defineProps<{
  role: string;
}>();
</script>

<template>
  <span
    v-if="role === 'super-admin'"
    class="relative px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 overflow-hidden"
  >
    <span class="relative z-10">Super Admin</span>
    <span
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none will-change-transform animate-shine"
    />
  </span>
  <span
    v-else-if="role.toLowerCase().includes('admin')"
    class="px-3 py-1 text-xs font-semibold text-white rounded-full bg-blue-500"
  >
    Admin
  </span>
  <span
    v-else
    class="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gray-400"
  >
    {{ role }}
  </span>
</template>
