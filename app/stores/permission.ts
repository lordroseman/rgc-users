import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Permission } from '~/types/common';

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>([]);
  const loaded = ref(false);
  const loading = ref(false); 
  const submitting = ref(false)
  const toast = useToast();

  const { getAll, remove, update, create } = useCrudApi<Permission>('/api/permissions');

  const fetchPermissions = async () => {
    if (loaded.value) return;
    loading.value = true;
    const response = await getAll();
    if (response.success) {
      permissions.value = response.data; 
      loaded.value = true;
    }
    loading.value = false;
  };

  const createPermission = async (payload: Partial<Permission>) => {
    submitting.value = true;
    const response = await create(payload as Permission);
    if (response.success) {
      permissions.value.unshift(response.data); 
      toast.add({ severity: 'success', summary: 'Success', detail: 'Permission created successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create permission', life: 3000 });
    }
    submitting.value = false;
  };

  const deletePermission = async (id: number) => {
    submitting.value = true;
    const response = await remove(id);
    if (response.success) {
      permissions.value = permissions.value.filter((p) => p.id !== id); 
      toast.add({ severity: 'success', summary: 'Success', detail: 'Permission deleted successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete permission', life: 3000 });
    }
    submitting.value = false;
  };

  const editPermission = async (id: number, payload: Partial<Permission>) => {
    submitting.value = true;
    const response = await update(id, payload);
    if (response.success) {
      updatePermission(response.data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Permission updated successfully', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update permission', life: 3000 });
    }
    submitting.value = false;
  };

  const getPermissionById = computed(() => (id: number) => {
    return permissions.value.find((p) => p.id === id);
  });

  const appendPermission = (p: Permission) => {
    permissions.value.unshift(p);
  };

  const updatePermission = (p: Permission) => {
    const index = permissions.value.findIndex((x) => x.id === p.id);
    if (index !== -1) permissions.value[index] = p;
  };

  return {
    permissions,
    loaded, 
    loading,
    getPermissionById,
    submitting,
    createPermission,
    fetchPermissions,
    appendPermission,
    updatePermission,
    deletePermission,
    editPermission,
  };
});
