<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  id: {
    type: [String, Number],
    required: true,
  },
  loading: Boolean,
});

const emit = defineEmits(["update:modelValue", "remove", "update:loading"]);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const remove = () => {
  if (props.loading) return;
  emit("remove", props.id);
  emit("update:loading", false);
};
</script>

<template>
  <Dialog
    v-model:visible="show"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <slot/>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        text
        :disabled="loading"
        @click="show = false"
      />
      <Button
        label="Yes"
        severity="danger"
        icon="pi pi-check"
        :loading="loading"
        @click="remove"
      />
    </template>
  </Dialog>
</template>
