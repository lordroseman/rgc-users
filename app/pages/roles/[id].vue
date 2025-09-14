<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { ref, watch, computed } from "vue";
import { RoleSchema } from "~/types";
import type { Role } from "~/types";
import type { Permission } from "~/types/common";

useHead({ title: "Roles" });

const route = useRoute();
const router = useRouter();
const idParam = route.params.id as string | undefined;
if (!idParam) {
  // no id, redirect back
  router.push("/roles");
}
const id = Number(idParam);

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const { permissions } = storeToRefs(permissionStore) as {
  permissions: Ref<Permission[]>;
};

const submitting = ref(false);

const showSaveToast = (success: boolean, message: string) => {
  const t = useToast();
  t.add({
    severity: success ? "success" : "error",
    summary: success ? "Success" : "Error",
    detail: message,
    life: 3000,
  });
};

const role = ref<Role | null>(null);
const selectedPermissions = ref<Array<number | string>>([]);

onMounted(async () => {
  await permissionStore.fetchPermissions();

  // load role
  const r = await roleStore.getRoleById(Number(id));
  if (r) {
    role.value = r;
    selectedPermissions.value = r.permissions!;

    setPermissionsListByGroup();
  }
});

const form = ref<Role>({ id: (null as unknown) as number, name: "-role-name-" });

watch(role, (r) => {
  if (r) {
    form.value = { id: r.id as number, name: r.name };
    form.value.name = r.name;
  }
});

const save = async (e: FormSubmitEvent) => {
  console.log(e);
  getSelectedPermissions();

  if (!e.valid) return;
  submitting.value = true;
  const values = e.values as Role;
  const payload = { name: values.name, permissions: selectedPermissions.value } as {
    name: string;
    permissions: Array<number | string>;
  };

  try {
    // convert permission ids to strings if back-end expects strings
    const permIds = selectedPermissions.value.map((v) => String(v));
    await roleStore.editRole(Number(id), ({
      ...payload,
      permissions: permIds,
    } as unknown) as Partial<Role & { permissions?: string[] }>);
    showSaveToast(true, "Role updated");
    // refresh lists
    await roleStore.fetchRoles();
    // navigate back to list
    router.push("/roles");
  } catch {
    showSaveToast(false, "Failed to update role");
  } finally {
    submitting.value = false;
  }
};

const resolver = ref(zodResolver(RoleSchema));

// segregate permissions by module prefix (e.g., 'hris:', 'admin:')
// This is optional and can be customized based on your permission naming conventions
const groupedPermissions = computed(() => {
  return (permissions.value || []).reduce((acc, p: Permission) => {
    const prefix = p.name.split(":")[0]!;
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push({ label: p.name, value: p.id });
    return acc;
  }, {} as Record<string, Array<{ label: string; value: number | string }>>);
});

const selectedPermissionsPerGroup = ref<Record<string, Array<string>>>({});

const setPermissionsListByGroup = () => {
  const grouped: Record<string, Array<string>> = {};
  (permissions.value || []).forEach((p) => {
    const prefix = p.name.split(":")[0]!;
    if (!grouped[prefix]) {
      grouped[prefix] = [];
    }
    if (selectedPermissions.value.includes(p.name)) {
      grouped[prefix].push(String(p.name));
    }
  });
  selectedPermissionsPerGroup.value = grouped;
};

const getSelectedPermissions = () => {
  const selected: Array<number | string> = [];
  Object.values(selectedPermissionsPerGroup.value).forEach((perms) => {
    perms.forEach((p) => {
      selected.push(p);
    });
  });

  selectedPermissions.value = selected;
};
</script>

<template>
  <div class="bg-white p-4">
    <Breadcrumb
      :home="{ icon: 'pi pi-home' }"
      :model="[{ label: 'Roles' }, { label: form.name || 'Role' }]"
    />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Role Detail</h1>

    <div class="mt-4">
      <div class="card">
        <Form
          v-slot="$form"
          :resolver="resolver"
          :initial-values="form"
          class="flex flex-col gap-4"
          @submit="save"
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1 min-w-96">
              <label for="name">Role Name</label>
              <InputText
                name="name"
                type="text"
                fluid
                :invalid="!!$form.name?.error?.message"
              />
              <FieldError v-if="$form.name" :message="$form.name.error?.message" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Panel
                v-for="(group, prefix) in groupedPermissions"
                :key="prefix"
                :header="prefix.toUpperCase()"
                class="flex flex-col gap-1 !bg-gray-200"
                :class="{
                  'row-span-2': prefix === 'hris',
                  'h-full': prefix === 'hris',
                }"
              >
                <label
                  >Permissions ::
                  {{ selectedPermissionsPerGroup[prefix]?.length ?? 0 }}</label
                >
                <Listbox
                  v-model="selectedPermissionsPerGroup[prefix]"
                  filter
                  :options="group"
                  multiple
                  option-label="label"
                  option-value="label"
                  class="mt-4 h-full !bg-gray-100"
                  scroll-height="400px"
                  checkmark
                />
              </Panel>
            </div>

            <div class="flex justify-end gap-2 mt-2">
              <Button type="button" label="Cancel" text @click="router.push('/roles')" />
              <Button type="submit" label="Save" :loading="submitting" />
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
