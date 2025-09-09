<script setup lang="ts"> 
import type { User } from '~/types/user';

useHead({ title: "Users" });

const home = ref({ icon: "pi pi-home" });
const items = ref([{ label: "Users" }]);

const showModal = ref(false);
const selected = ref<User | null>(null);

const onOpenModal = (user: User | null = null) => {
  selected.value = user;
  showModal.value = true;
};


const usersTable = useTemplateRef("usersTable");

const userStore = useUserStore();
const {  loaded } = storeToRefs(userStore);
const onSaved = async () => {
  loaded.value = false;
  await usersTable.value?.loadUsers();
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
  await userStore.deleteUser(id);
  deleting.value = false;
  showDelete.value = false;
  deleteId.value = null; 
};





</script>

<template>
  <div class="bg-white">
    <Breadcrumb :home="home" :model="items" />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Users</h1>
    <div>
      <UsersTable ref="usersTable" @open-modal="onOpenModal" @delete="confirmDelete" />


          <UserModal
            v-model="showModal"
            :user="selected"
            @created="onSaved"
            @updated="onSaved"
            
          />

          <DeleteDialog
            :id="deleteId ?? 0"
            v-model="showDelete"
            :loading="deleting"
            @remove="remove"
          >
            <span>Are you sure you want to delete this user?</span>
          </DeleteDialog>
    </div>
  </div>
</template>
