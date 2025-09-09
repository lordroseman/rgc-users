<script lang="ts" setup>
import type { MenuItem } from "@/types/menu";

// Static sidebar menu structure; group items can contain nested children
const items = ref<MenuItem[]>([
  { label: "IAM", type: "subtitle" },
  {
    label: "Users",
    to: "/users",
    icon: "ic:baseline-groups",
  },
 
]);

const route = useRoute();
// Active when current path starts with item's path;
// for groups, active if any child is active
const isActive = (item: MenuItem): boolean | undefined => {
  if (item.to) return route.path.startsWith(item.to)
  if (item.items && item.items.length) {
    return item.items.some((c) => (c.to ? route.path.startsWith(c.to) : false))
  }
};

// Toggle open/closed state for a group
const toggleGroup = (item: MenuItem) => {
  item.open = !item.open;
};

watch(
  () => route.path,
  () => {
    // Auto-open any group with an active child on route change
    items.value.forEach((it) => {
      if (it.items && it.items.length) {
        it.open = !!it.items.find((c) => (c.to ? route.path.startsWith(c.to) : false));
      }
    });
  },
  { immediate: true }
);

const appStore = useAppStore();
</script>

<template>
  <aside
    id="drawer-navigation"
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform duration-300 -translate-x-full border-r bg-gray-800 border-gray-700"
    :class="{
      // Slide-in on mobile when sidebarOpen is true
      'md:-translate-x-full translate-x-0': appStore.sidebarOpen,
      'md:translate-x-0': !appStore.sidebarOpen,
    }"
    aria-label="Sidenav"
  >
    <div class="overflow-y-auto py-5 px-3 h-full bg-gray-800">
      <ul class="space-y-2">
        <li v-for="item in items" :key="item.label">
          <template v-if="item.type === 'subtitle'">
            <div
              class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none cursor-default opacity-80"
            >
              {{ item.label }}
            </div>
          </template>
          <template v-else-if="item.items && item.items.length">
            <button
              class="w-full flex items-center justify-between p-2 rounded-lg text-white hover:bg-gray-700"
              :class="{ 'bg-gray-700': isActive(item) }"
              @click="toggleGroup(item)"
            >
              <span class="flex items-center">
                <Icon v-if="item.icon" size="24px" :name="item.icon" class="transition duration-75 text-gray-400 group-hover:text-white" />
                <span class="ml-3">{{ item.label }}</span>
              </span>
              <i class="pi pi-chevron-right transition-all" :class="item.open ? 'rotate-90' : ''" />
            </button>
            <Transition name="fade">
              <ul v-show="item.open" class="mt-1 ml-3 pl-4 border-l border-gray-700 space-y-1">
                <li v-for="child in item.items" :key="child.label">
                  <MenuLink :item="child" :active="isActive(child)" />
                </li>
              </ul>
            </Transition>
          </template>
          <template v-else>
            <MenuLink :item="item" :active="isActive(item)" />
          </template>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
