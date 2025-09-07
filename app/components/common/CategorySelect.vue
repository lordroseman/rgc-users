<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedCategory = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const categoriesStore = useCategoriesStore();
const { categories, categoriesLoaded, isLoading } = storeToRefs(categoriesStore);

onMounted(() => {
  if (!categoriesLoaded.value) {
    categoriesStore.fetchCategories();
  }
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <span for="item_description">Category</span>
    <Select
      v-model="selectedCategory"
      :options="categories"
      filter
      option-label="name"
      class="w-full"
      :loading="isLoading"
    />
    <Message v-if="invalid" severity="error" size="small" variant="simple">{{
      message
    }}</Message>
  </div>
</template>
