<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

// Internal Date object for PrimeVue DatePicker
const internalDate = ref<Date | null>(null);

// Watch incoming string and convert to Date
watch(
  () => props.modelValue,
  (val) => {
    console.log("modelValue", val);
    // internalDate.value = val ? new Date(val) : null;
  },
  { immediate: true }
);

const emitString = (date: Date | Date[] | (Date | null)[] | null | undefined) => {
  if (!date) {
    emit("update:modelValue", null);
  } else {
    let dt = null;
    if (Array.isArray(date)) {
      dt = date[0];
    } else {
      dt = date as Date;
    }

    const yyyy = dt!.getFullYear();
    const mm = String(dt!.getMonth() + 1).padStart(2, "0");
    const dd = String(dt!.getDate()).padStart(2, "0");

    console.log(`emitted ${yyyy}-${mm}-${dd}`);
    emit("update:modelValue", `${yyyy}-${mm}-${dd}`);
  }
};
</script>

<template>
  <div>
    <DatePicker
      v-model="internalDate"
      :show-icon="true"
      :manual-input="true"
      :placeholder="placeholder"
      @update:model-value="emitString"
    />
    <EmployeesTable />
  </div>
</template>
