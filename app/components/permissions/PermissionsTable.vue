<script setup lang="ts">
import type { DataTableFilterMetaData } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { useDebounceFn } from '@vueuse/core';
import type { Permission } from '~/types/common'; 
import { storeToRefs } from 'pinia';

const permissionStore = usePermissionStore();
const { permissions, loading } = storeToRefs(permissionStore) 
const fetchPermissions = permissionStore.fetchPermissions as () => Promise<void>;

onMounted(() => {
  loadPermissions();
});

type PermFilters = {
  q: DataTableFilterMetaData;
  name: DataTableFilterMetaData;
};

const filters = ref<PermFilters>({
  q: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emit = defineEmits(['open-modal', 'delete']);

const hasFilters = computed(() => !!filters.value.q.value || !!filters.value.name.value);

const clearFilters = () => {
  filters.value.q.value = null;
  filters.value.name.value = null;
};

const openCreate = () => emit('open-modal');

const { can } = useCan();
const menu = useTemplateRef('menu');

const selected = ref<Permission | null>(null);
const toggle = (event: MouseEvent, data: Permission) => {
  selected.value = data;
  nextTick(() => menu.value?.toggle(event));
};

const menuItems = computed(() => {
  const items: Array<{ label: string; icon?: string; command?: () => void }> = [];
  if (can('hris:company.update')) {
    items.push({ label: 'Edit', icon: 'pi pi-pencil', command: () => emit('open-modal', selected.value) });
  }
  if (can('hris:company.delete')) {
  items.push({ label: 'Delete', icon: 'pi pi-trash', command: () => emit('delete', selected.value?.id) });
  }
  return [{ label: 'Options', items }];
});

const loadPermissions = useDebounceFn(async () => {
  loading.value = true;
  // fetch full list once; client-side DataTable will paginate/filter/sort
  await fetchPermissions();
  loading.value = false;
}, 300);

defineExpose({ loadPermissions });
</script>

<template>
  <div class="card">
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="permissions"
      data-key="id"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5,10,25]"
      :loading="loading"
      filter-display="menu"
      selection-mode="single"
    >
      <template #header>
        <div class="flex justify-between gap-4">
          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters.name.value" class="w-full" placeholder="Search..." />
          </IconField>

          <div class="flex-shrink-0 flex gap-4">
            <Button v-if="hasFilters || filters.name.value" icon="pi pi-filter-slash" severity="secondary" label="Clear Filter" @click="clearFilters" />
            <Button icon="pi pi-plus" label="Add Permission" class="flex-shrink-0" @click="openCreate" />
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center justify-center h-64">
          <i class="pi pi-lock" style="font-size: 2.5rem" />
          <span v-if="loading">Loading permissions...</span>
          <span v-else>No permissions found</span>
        </div>
      </template>

     

      <Column field="name" header="Permission" sortable style="min-width: 12rem">
        <template v-if="loading" #body>
          <Skeleton />
        </template>
      </Column>

      <Column header-style="width: 8rem" body-style="text-align:right" :pt="{ root: '!py-1.5' }">
        <template #body="{ data }">
          <Button type="button" icon="pi pi-ellipsis-v" aria-haspopup="true" aria-controls="overlay_menu" severity="secondary" rounded @click="toggle($event, data)" />
        </template>
      </Column>
    </DataTable>

    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="{ item }">
        <Button v-if="item.label === 'Edit'" icon="pi pi-pencil" text label="Edit" />
        <Button v-else-if="item.label === 'Delete'" icon="pi pi-trash" text severity="danger" label="Delete" />
      </template>
    </Menu>
  </div>
</template>
