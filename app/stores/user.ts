
  
import type { PaginationMeta, PaginationRequestParam } from "~/types/common";
import type { User } from "~/types/user";


export const useUserStore = defineStore('user', () =>{

    const users = ref<User[]>([]);
    const loaded = ref(false); 
    const loading = ref(false);
     const pagination = ref<PaginationMeta>({
        total: 0
    } as PaginationMeta);
    const toast = useToast();
    
    const { getAll, remove, update  } = useCrudApi<User>('/api/users');

    const fetchUsers = async (params: PaginationRequestParam) => {
        if(loaded.value) {
            return;
        }    
        loading.value = true;
        const response = await getAll(params);
        if (response.success) {
            users.value = response.data
            pagination.value = response.meta!
        }
        loading.value = false;
       
    }


    const deleteUser = async (id: number) => {
        loading.value = true; 
        const response = await remove(id);
        if (response.success) {
            users.value = users.value.filter(user => user.id !== id);
            pagination.value.total -= 1;
            toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 });
        }
        loading.value = false;
    }

    const editUser = async (id: number, user: Partial<User>) => {
        loading.value = true;
        const response = await update(id, user);
        if (response.success) {
            updateUser(response.data);
            toast.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 });
        }
        loading.value = false;
    }

    const getUserById = computed(() => (id: number) => {
        return users.value.find((user) => user.id === id);
    });

    const appendUser = (user: User) => {
        users.value.unshift(user);
    }

    const updateUser = (user: User) => {
        const index = users.value.findIndex((u) => u.id === user.id);
        if(index !== -1) {
            users.value[index] = user;
        }
    }

    



    return {
        users,
        loaded,
        pagination,
        loading,
        getUserById,
        fetchUsers,
        appendUser,
        updateUser,
        deleteUser,
        editUser
    }
});
