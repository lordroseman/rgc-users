<script setup lang="ts">
const props = defineProps<{
  status: "ACTIVE" | "INACTIVE" | "FORCE_CHANGE_PASSWORD" | string | null;
}>();

const normalizedStatus = computed(() => props.status?.toUpperCase?.() ?? "");

const statusConfig = computed(() => {
  switch (normalizedStatus.value) {
    case "ACTIVE":
      return { label: "Active", classes: "bg-green-500 text-white" };
    case "INACTIVE":
      return { label: "Inactive", classes: "bg-gray-400 text-white" };
    case "FORCE_CHANGE_PASSWORD":
      return {
        label: "Force Change Password",
        classes: "bg-amber-500 text-white",
      };
    default:
      return { label: props.status, classes: "bg-slate-400 text-white" };
  }
});
</script>

<template>
  <span
    class="px-3 py-1 text-xs font-semibold rounded-full"
    :class="statusConfig.classes"
  >
    {{ statusConfig.label }}
  </span>
</template>
