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
  router.push("/roles");
}
const id = Number(idParam);

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const { permissions } = storeToRefs(permissionStore) as {
  permissions: Ref<Permission[]>;
};

const submitting = ref(false);
const permissionSearch = ref("");

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
// Flat set of selected permission names
const selectedPermissions = ref<Set<string>>(new Set());

onMounted(async () => {
  await permissionStore.fetchPermissions();
  const r = await roleStore.getRoleById(Number(id));
  if (r) {
    role.value = r;
    selectedPermissions.value = new Set((r.permissions ?? []).map(String));
  }
});

const form = ref<Role>({ id: (null as unknown) as number, name: "" });

watch(role, (r) => {
  if (r) {
    form.value = { id: r.id as number, name: r.name };
  }
});

// Parse: "app:module.action" → { app, module, action }
interface ParsedPermission {
  app: string;
  module: string;
  action: string;
  name: string;
}

const parsedPermissions = computed<ParsedPermission[]>(() =>
  (permissions.value || [])
    .map((p: Permission) => {
      const [appPart, rest] = p.name.split(":");
      const dotIdx = rest?.indexOf(".") ?? -1;
      const module = dotIdx >= 0 ? rest?.slice(0, dotIdx) ?? rest ?? "" : rest ?? "";
      const action = dotIdx >= 0 ? rest?.slice(dotIdx + 1) ?? "" : "";
      return { app: appPart ?? p.name, module, action, name: p.name };
    })
    .sort((a, b) => a.name.localeCompare(b.name))
);

// Group: app → module → permissions[]
type GroupedMap = Record<string, Record<string, ParsedPermission[]>>;
const groupedPermissions = computed<GroupedMap>(() => {
  const filtered = permissionSearch.value.trim()
    ? parsedPermissions.value.filter((p) =>
        p.name.toLowerCase().includes(permissionSearch.value.toLowerCase())
      )
    : parsedPermissions.value;

  return filtered.reduce<GroupedMap>((acc, p) => {
    if (!acc[p.app]) acc[p.app] = {};
    if (!acc[p.app]![p.module]) acc[p.app]![p.module] = [];
    acc[p.app]![p.module]!.push(p);
    return acc;
  }, {});
});

const sortedApps = computed(() => Object.keys(groupedPermissions.value).sort());

// Selection helpers
const isSelected = (name: string) => selectedPermissions.value.has(name);

const togglePermission = (name: string) => {
  const s = new Set(selectedPermissions.value);
  if (s.has(name)) {
    s.delete(name);
  } else {
    s.add(name);
  }
  selectedPermissions.value = s;
};

const appPermissions = (app: string) =>
  Object.values(groupedPermissions.value[app] ?? {}).flat();

const isAppAllSelected = (app: string) =>
  appPermissions(app).every((p) => selectedPermissions.value.has(p.name));

const isAppIndeterminate = (app: string) => {
  const perms = appPermissions(app);
  const count = perms.filter((p) => selectedPermissions.value.has(p.name)).length;
  return count > 0 && count < perms.length;
};

const toggleApp = (app: string) => {
  const s = new Set(selectedPermissions.value);
  const all = isAppAllSelected(app);
  appPermissions(app).forEach((p) => (all ? s.delete(p.name) : s.add(p.name)));
  selectedPermissions.value = s;
};

const modulePermissions = (app: string, mod: string) =>
  groupedPermissions.value[app]?.[mod] ?? [];

const isModuleAllSelected = (app: string, mod: string) =>
  modulePermissions(app, mod).every((p) => selectedPermissions.value.has(p.name));

const isModuleIndeterminate = (app: string, mod: string) => {
  const perms = modulePermissions(app, mod);
  const count = perms.filter((p) => selectedPermissions.value.has(p.name)).length;
  return count > 0 && count < perms.length;
};

const toggleModule = (app: string, mod: string) => {
  const s = new Set(selectedPermissions.value);
  const all = isModuleAllSelected(app, mod);
  modulePermissions(app, mod).forEach((p) => (all ? s.delete(p.name) : s.add(p.name)));
  selectedPermissions.value = s;
};

const totalSelected = computed(() => selectedPermissions.value.size);
const totalPermissions = computed(() => parsedPermissions.value.length);

const resolver = ref(zodResolver(RoleSchema));

const save = async (e: FormSubmitEvent) => {
  if (!e.valid) return;
  submitting.value = true;
  const values = e.values as Role;
  try {
    await roleStore.editRole(Number(id), ({
      name: values.name,
      permissions: Array.from(selectedPermissions.value),
    } as unknown) as Partial<Role & { permissions?: string[] }>);
    showSaveToast(true, "Role updated successfully");
    await roleStore.fetchRoles();
    router.push("/roles");
  } catch {
    showSaveToast(false, "Failed to update role");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Header -->
    <div class="border-b px-6 py-4">
      <Breadcrumb
        :home="{ icon: 'pi pi-home', route: '/' }"
        :model="[{ label: 'Roles', route: '/roles' }, { label: form.name || 'Role' }]"
        class="mb-2 !p-0 !bg-transparent"
      />
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          severity="secondary"
          @click="router.push('/roles')"
        />
        <h1 class="text-xl font-semibold text-gray-800">Role Detail</h1>
      </div>
    </div>

    <Form
      v-slot="$form"
      :key="role?.id ?? undefined"
      :resolver="resolver"
      :initial-values="form"
      @submit="save"
    >
      <div class="px-6 py-5 flex flex-col gap-6 max-w-6xl mx-auto">
        <!-- Role Name Card -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            General
          </h2>
          <div class="flex flex-col gap-1 max-w-md">
            <label for="name" class="text-sm font-medium text-gray-700">Role Name</label>
            <InputText
              name="name"
              type="text"
              fluid
              placeholder="e.g. Administrator"
              :invalid="!!$form.name?.error?.message"
            />
            <FieldError v-if="$form.name" :message="$form.name.error?.message" />
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
          <!-- Permissions Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100"
          >
            <div>
              <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Permissions
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">
                <span class="font-semibold text-primary">{{ totalSelected }}</span>
                of
                <span class="font-semibold">{{ totalPermissions }}</span>
                permissions selected
              </p>
            </div>
            <div class="flex items-center gap-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="permissionSearch"
                  placeholder="Search permissions…"
                  size="small"
                  class="w-56"
                />
              </IconField>
            </div>
          </div>

          <!-- No results -->
          <div
            v-if="sortedApps.length === 0"
            class="flex flex-col items-center justify-center py-16 text-gray-400"
          >
            <i class="pi pi-search text-3xl mb-2" />
            <p class="text-sm">No permissions match your search.</p>
          </div>

          <!-- App Groups -->
          <Accordion
            v-else
            :multiple="true"
            :value="sortedApps"
            class="!border-none rounded-xl overflow-hidden"
          >
            <AccordionPanel
              v-for="app in sortedApps"
              :key="app"
              :value="app"
              class="!border-x-0 last:!border-b-0"
            >
              <AccordionHeader class="!px-5 !py-3 hover:!bg-gray-50">
                <div class="flex items-center gap-3 w-full">
                  <Checkbox
                    :model-value="isAppAllSelected(app)"
                    :indeterminate="isAppIndeterminate(app)"
                    binary
                    @change="toggleApp(app)"
                    @click.stop
                  />
                  <div class="flex items-center gap-2 flex-1">
                    <span class="font-semibold text-gray-800 capitalize">{{ app }}</span>
                    <Tag
                      :value="`${
                        appPermissions(app).filter((p) => isSelected(p.name)).length
                      } / ${appPermissions(app).length}`"
                      severity="secondary"
                      class="text-xs !py-0.5"
                    />
                  </div>
                </div>
              </AccordionHeader>
              <AccordionContent class="!p-0">
                <div class="divide-y divide-gray-100">
                  <div
                    v-for="(perms, mod) in groupedPermissions[app]"
                    :key="mod"
                    class="px-5 py-3"
                  >
                    <!-- Module header -->
                    <div class="flex items-center gap-2 mb-2">
                      <Checkbox
                        :model-value="isModuleAllSelected(app, mod)"
                        :indeterminate="isModuleIndeterminate(app, mod)"
                        binary
                        @change="toggleModule(app, mod)"
                      />
                      <span
                        class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {{ mod || "(general)" }}
                      </span>
                      <span class="text-xs text-gray-400">
                        ({{ perms.filter((p) => isSelected(p.name)).length }}/{{
                          perms.length
                        }})
                      </span>
                    </div>
                    <!-- Actions grid -->
                    <div
                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-3 pl-6"
                    >
                      <div
                        v-for="perm in perms"
                        :key="perm.name"
                        class="flex items-center gap-1.5 cursor-pointer group"
                        @click="togglePermission(perm.name)"
                      >
                        <Checkbox
                          :model-value="isSelected(perm.name)"
                          binary
                          class="pointer-events-none"
                        />
                        <span
                          class="text-sm text-gray-700 group-hover:text-primary truncate"
                          :title="perm.name"
                        >
                          {{ perm.action || perm.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pb-4">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            text
            @click="router.push('/roles')"
          />
          <Button
            type="submit"
            label="Save Changes"
            icon="pi pi-check"
            :loading="submitting"
          />
        </div>
      </div>
    </Form>
  </div>
</template>
