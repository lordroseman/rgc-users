<script setup lang="ts">
import type { Role } from '~/types';

useHead({ title: 'Roles' });

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Roles' }]);

const showModal = ref(false);
const selected = ref<Role | null>(null);

const onOpenModal = (r: Role | null = null) => {
  selected.value = r;
  showModal.value = true;
};

const rolesTable = useTemplateRef('rolesTable');

const roleStore = useRoleStore();
const onSaved = async () => {
  await roleStore.fetchRoles();
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
  await roleStore.deleteRole(id);
  deleting.value = false;
  showDelete.value = false;
  deleteId.value = null;
  await onSaved();
};

onMounted(async () => {
  await roleStore.fetchRoles();
});
</script>

<template>
  <div class="bg-white">
    <Breadcrumb :home="home" :model="items" />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Roles</h1>
    <div>
      <RolesTable ref="rolesTable" @open-modal="onOpenModal" @delete="confirmDelete" />

      <RoleModal v-model="showModal" :role="selected" @saved="onSaved" />

      <DeleteDialog
        :id="deleteId ?? 0"
        v-model="showDelete"
        :loading="deleting"
        @remove="remove"
      >
        <span>Are you sure you want to delete this role?</span>
      </DeleteDialog>
    </div>
  </div>
</template>
