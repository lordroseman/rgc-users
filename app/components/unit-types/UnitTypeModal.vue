<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const form = ref({
  item_code: "",
  item_description: "",
  category_id: "",
  unit_measurement_id: "",
  unit_type: "",
  stock_unit: "",
  purchase_unit: "",
  sale_unit: "",
  purchase_price: null,
});

const resolver = ref(
  zodResolver(
    z.object({
      item_code: z.string().min(1, "Item code is required"),
      item_description: z.string().min(1, "Item description is required"),
      category_id: z.string().min(1, "Category is required"),
      unit_measurement_id: z.string().min(1, "Unit measurement is required"),
      purchase_price: z
        .number()
        .min(0, "Purchase price must be a positive number")
        .nullable(),
    })
  )
);

const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    // Handle form submission logic here
    console.log("Form submitted:", form.value);
    visible.value = false; // Close the modal after submission
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add New Material"
    :style="{ width: '40vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="flex">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initial-values="form"
        class="flex flex-col gap-4 w-full"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <label for="item_code">Item Code</label>
          <InputText name="item_code" type="text" fluid />
          <Message
            v-if="$form.item_code?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.item_code.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1">
          <label for="item_description">Item Description</label>
          <InputText name="item_description" type="text" fluid />
          <Message
            v-if="$form.item_description?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.item_description.error?.message }}</Message
          >
        </div>

        <CategorySelect
          v-model="$form.category_id"
          :invalid="$form.category_id?.invalid"
          :message="$form.category_id?.error?.message"
          name="category_id"
        />

        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </div>
  </Dialog>
</template>
