import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Role } from '~/types';

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([]);
  const loaded = ref(false);
  const loading = ref(false);
  const submitting = ref(false);
  const toast = useToast();

  const { getAll, remove, update, create, get } = useCrudApi<Role>('/api/roles');

  const fetchRoles = async () => {
    if (loaded.value) return;
    loading.value = true;
    const response = await getAll();
    if (response.success) {
      roles.value = response.data;
      loaded.value = true;
    }
    loading.value = false;
  };

  const createRole = async (payload: Partial<Role>) => {
    submitting.value = true;
    const response = await create(payload as Role);
    if (response.success) {
      roles.value.unshift(response.data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Role created successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create role', life: 3000 });
    }
    submitting.value = false;
  };

  const deleteRole = async (id: number) => {
    submitting.value = true;
    const response = await remove(id);
    if (response.success) {
      roles.value = roles.value.filter((r) => r.id !== id);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Role deleted successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete role', life: 3000 });
    }
    submitting.value = false;
  };

  const editRole = async (id: number, payload: Partial<Role>) => {
    submitting.value = true;
    const response = await update(id, payload);
    if (response.success) {
      updateRole(response.data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Role updated successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update role', life: 3000 });
    }
    submitting.value = false;
  };

  const getRoleById = async (id: number) => {
    const response = await get(id);
    if (response.success) {
      return response.data;
    }
    return null;
  };

  const appendRole = (r: Role) => roles.value.unshift(r);

  const updateRole = (r: Role) => {
    const idx = roles.value.findIndex((x) => x.id === r.id);
    if (idx !== -1) roles.value[idx] = r;
  };

  return {
    roles,
    loaded,
    loading,
    submitting,
    getRoleById,
    fetchRoles,
    createRole,
    appendRole,
    updateRole,
    deleteRole,
    editRole,
  };
});
