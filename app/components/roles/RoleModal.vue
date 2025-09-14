<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { ref, watch } from 'vue';
import { RoleSchema } from '~/types';
import type { Role } from '~/types';

const props = defineProps<{ modelValue: boolean; role?: Role | null }>();
const emit = defineEmits(['update:modelValue', 'saved']);

const roleStore = useRoleStore();
const { submitting } = storeToRefs(roleStore);

const show = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });

const form = ref<Role>({ id: null as unknown as number, name: '' });

watch(show, (val) => {
  if (val) {
    if (props.role) form.value = { ...props.role };
    else form.value = { id: null as unknown as number, name: '' };
  }
});

const save = async (e: FormSubmitEvent) => {
  if (!e.valid) return;
  submitting.value = true;
  const values = e.values as Role;

  try {
    if (props.role?.id) {
      const changes: Partial<Role> = useDifference<Role>(values as Role, form.value);
      await roleStore.editRole(Number(props.role.id), changes);
    } else {
      await roleStore.createRole(values);
    }
    show.value = false;
    emit('saved');
  } catch {
    submitting.value = false;
    // backend error handling omitted for brevity; mirror PermissionModal if needed
  }
};

const resolver = ref(zodResolver(RoleSchema));

</script>

<template>
  <Dialog v-model:visible="show" header="Role">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initial-values="form"
      class="flex flex-col gap-4"
      @submit="save"
    >
      <div class="flex flex-col gap-1 min-w-96">
        <label for="name">Role Name</label>
        <InputText name="name" type="text" fluid :invalid="!!$form.name?.error?.message" />
        <FieldError v-if="$form.name" :message="$form.name.error?.message" />
      </div>

      <div class="flex justify-end gap-2 mt-2">
        <Button type="button" label="Cancel" text @click="show = false" />
        <Button type="submit" label="Save" :loading="submitting" />
      </div>
    </Form>
  </Dialog>
</template>
