<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { OnFetchErrorContext } from '@vueuse/core';
import { ref, watch } from 'vue';
import { PermissionSchema } from '~/types';
import type { Permission } from '~/types/common';

const props = defineProps<{ modelValue: boolean; permission?: Permission | null }>();
const emit = defineEmits(['update:modelValue', 'saved']);

const permissionStore = usePermissionStore();
const { submitting } = storeToRefs(permissionStore);

const show = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });

const form = ref<Permission>({ id: null as unknown as number, name: '' });


watch(show, (val) => {
  if (val) {
    if (props.permission) form.value = { ...props.permission };
  else form.value = { id: null as unknown as number, name: '' };
  }
});
 

const save = async (e: FormSubmitEvent) => {
console.log('save', e);
     if (!e.valid) return;
  submitting.value = true;
  backendError.value = undefined;

  const values = e.values as Permission; 
 
 

  try {
    if (props.permission?.id) {
      const changes: Partial<Permission> = useDifference<Permission>(
        values as Permission,
        form.value
      );
      await permissionStore.editPermission(Number(props.permission.id), changes);
    } else {
       await permissionStore.createPermission(values);
    }
    show.value = false;
  } catch (error) {

     const err = error as unknown as OnFetchErrorContext;
 

    submitting.value = false;
    backendError.value = err.data.errors as Record<keyof Permission, string[]> | undefined; 
    return;
  }
   

};

const resolver = ref(zodResolver(PermissionSchema));
const backendError = ref<Record<keyof Permission, string[]>>();

</script>

<template>
  <Dialog v-model:visible="show" header="Permission">
   <Form
      v-slot="$form"
      :resolver="resolver"
      :initial-values="form"
      class="flex flex-col gap-4"
      @submit="save"
    >

      <div class="flex flex-col gap-1 min-w-96">
        <label for="name">Permission Name</label>
        <InputText name="name" type="text" fluid :invalid="!!($form.name?.error?.message || backendError?.name)" />
        <FieldError
          v-if="$form.name"
          :message="$form.name.error?.message || backendError?.name"
        />
      </div>

       <div class="flex justify-end gap-2 mt-2">
        <Button type="button" label="Cancel" text @click="show = false" />
        <Button type="submit" label="Save" :loading="submitting" />
      </div>
   </Form> 
   </Dialog>
</template>
