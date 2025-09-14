<script setup lang="ts">
import type { Permission } from '~/types/common';

useHead({ title: 'Permissions' });

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Permissions' }]);

const showModal = ref(false);
const selected = ref<Permission | null>(null);

const onOpenModal = (p: Permission | null = null) => {
  selected.value = p;
  showModal.value = true;
};

const permissionsTable = useTemplateRef('permissionsTable');

const permissionStore = usePermissionStore();
const onSaved = async () => {
  await permissionStore.fetchPermissions();
};

const showDelete = ref(false);
const deleteId = ref<number | null>(null);
const deleting = ref(false);

const confirmDelete = (id: number) => {
  deleteId.value = id;
  showDelete.value = true;
};

const remove = async (id: number) => {
  deleting.value = true; 
  await permissionStore.deletePermission(id);
  deleting.value = false;
  showDelete.value = false;
  deleteId.value = null;
  await onSaved();
};

onMounted(async () => {
  await permissionStore.fetchPermissions();
});
</script>

<template>
  <div class="bg-white">
    <Breadcrumb :home="home" :model="items" />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Permissions</h1>
    <div>
      <PermissionsTable ref="permissionsTable" @open-modal="onOpenModal" @delete="confirmDelete" />

      <PermissionModal v-model="showModal" :permission="selected" @saved="onSaved" />

      <DeleteDialog
        :id="deleteId ?? 0"
        v-model="showDelete"
        :loading="deleting"
        @remove="remove"
      >
        <span>Are you sure you want to delete this permission?</span>
      </DeleteDialog>
    </div>
  </div>
</template>
