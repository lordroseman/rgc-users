import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Role } from '~/types';

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const api = useCrudApi<Role>('/api/roles');

  async function fetchRoles() {
    loading.value = true;
    error.value = null;
    try {
      // Replace with your actual API endpoint
      const res = await api.getAll();
      if(res.success) {
        roles.value = res.data;
      }

     
    } catch (e) {
      error.value = (e as Error).message || 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

 

  return { roles, loading, error, fetchRoles };
});
