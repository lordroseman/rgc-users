<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import type { OnFetchErrorContext } from "@vueuse/core";
import { UserSchema, type User } from "~/types/user";

const props = defineProps<{
  modelValue: boolean;
  user?: User | null;
}>();

const emit = defineEmits(["update:modelValue", "created", "updated", "update:user"]);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const form = ref<User>({ 
  id: 0,
  id_num: "",
  name: "",
  email: "",
  username: "",
  password: "",
  roles: [],
});

watch(show, (val) => {
  if (val) {
    if (props.user) {
      form.value = {
        id: props.user.id,
        id_num: props.user.id_num,
        name: props.user.name,
        email: props.user.email,
        username: props.user.username,
        roles: props.user.roles, 
        password: ''
      };
    } else {
      form.value = { id: null, id_num: "", name: "", email: "", username: "",  roles: [], password: "" };
    }

    backendError.value = undefined;
  }
});
    
const resolver = ref(zodResolver(UserSchema));
const loading = ref(false);
const backendError = ref<Record<keyof User, string[]>>();
 
const userStore = useUserStore();
const roleStore = useRoleStore();
const toast = useToast();

onMounted(() => {
    if(roleStore.roles.length === 0 )
            roleStore.fetchRoles();
});

const onSubmit = async (e: FormSubmitEvent) => {
  if (!e.valid) return;
  loading.value = true;
  backendError.value = undefined;

  const values = e.values as User;
  const api = useCrudApi<User>(`/api/users`);
 

  let res;

  try {
    if (props.user?.id) {
      const changes: Partial<User> = useDifference<User>(
        values as User,
        form.value
      );
      res = await api.update(props.user.id, changes);
    } else {
      res = await api.create(values); 
    }
  } catch (error) {

     const err = error as unknown as OnFetchErrorContext;

    console.log(err.data);

    loading.value = false;
    backendError.value = err.data.errors as Record<keyof User, string[]> | undefined;
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.data.message || 'An unexpected error occurred. Please try again later.',
        life: 3000
    });
    return;
  }
  

  loading.value = false;
  if (!res.success) {
    console.log(res);
    backendError.value = res.errors;
    return;
  } else {
         toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `User has been ${props.user ? 'updated' : 'added'} successfully`,
            life: 3000
        })

        if(props.user) {
            userStore.updateUser(res.data);
        } else {
            userStore.appendUser(res.data);
        }

         show.value = false;
  }

};
</script>

<template>
  <Dialog
    v-model:visible="show"
    :header="props.user ? 'Edit User' : 'Add User'"
    :modal="true"
    :style="{ width: '32rem' }"
  >
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initial-values="form"
      class="flex flex-col gap-4"
      @submit="onSubmit"
    >

  <!-- include id in submitted values so schema knows this is an update -->
  <input type="hidden" name="id" :value="form.id" >


      <div class="flex flex-col gap-1">
        <label for="id_num">Employee ID Number</label>
        <InputText name="id_num" type="text" fluid />
        <FieldError
          v-if="$form.id_num"
          :message="$form.id_num.error?.message || backendError?.id_num"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="name">Name</label>
        <InputText name="name" type="text" fluid />
        <FieldError
          v-if="$form.name"
          :message="$form.name.error?.message || backendError?.name"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="email">Email</label>
        <InputText name="email" type="email" fluid />
        <FieldError
          v-if="$form.email"
          :message="$form.email.error?.message || backendError?.email"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="username">Username</label>
        <InputText name="username" type="text" fluid />
        <FieldError
          v-if="$form.username"
          :message="$form.username.error?.message || backendError?.username"
        />
      </div>

      <div v-if="!props.user" class="flex flex-col gap-1">
        <label for="password">Password</label>
        <Password  name="password" type="password" fluid toggle-mask :feedback="false" />
        <FieldError
          v-if="$form.password"
          :message="$form.password.error?.message || backendError?.password"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="roles">Roles</label>
        <MultiSelect
          name="roles"
          :options="roleStore.roles"
          option-label="name"
          option-value="name"
          placeholder="Select roles"
          :selection-limit="1"
          show-clear
          filter
          class="w-full"
        />
        <FieldError
          v-if="$form.roles"
          :message="$form.roles.error?.message || backendError?.roles"
        />
      </div>

      <div class="flex justify-end gap-2 mt-2">
        <Button type="button" label="Cancel" text @click="show = false" />
        <Button type="submit" label="Save" :loading="loading" />
      </div>
    </Form>
  </Dialog>
</template>
