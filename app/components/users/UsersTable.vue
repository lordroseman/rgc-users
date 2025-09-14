<script setup lang="ts">
import type { User } from "~/types/user";
import { FilterMatchMode } from "@primevue/core/api";
import type { DataTableFilterEvent, DataTableFilterMetaData, DataTablePageEvent,  DataTableSortEvent } from "primevue";
import type { PaginationRequestParam } from "~/types/common";
import { useDebounceFn } from "@vueuse/core";

const userStore = useUserStore();
const { users, loading, pagination } = storeToRefs(userStore);

onMounted(() => {
  loadUsers();
});

// Filters (client-side like EmployeesTable UI)
type UserFilters = {
  q: DataTableFilterMetaData;
  id_num: DataTableFilterMetaData;
  name: DataTableFilterMetaData;   
  roles: DataTableFilterMetaData;
};

const filters = ref<UserFilters>({
  q: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id_num: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS }, 
  roles: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const emit = defineEmits(["openModal", "delete"]);

const params = ref<PaginationRequestParam>({
  page: {
    number: 1,
    size: 10,
  },
  filter: { },
  sort: "id_num",
});

const hasFilters = computed(() => {
  const f = filters.value;
  return !!f.name.value  ;
});

const clearFilters = () => {
  filters.value.q.value = null;
  filters.value.name.value = null;
  filters.value.id_num.value = null;
};


watch(
  () => filters.value.q.value,
  (val) => {
    if (!params.value.filter) {
      params.value.filter = {
        active: true,
      };
    }

    if (val) {
      params.value.filter.q = val;
    } else {
      delete params.value.filter.q;
    }

    params.value.page.number = 1;
    loadUsers();
  },
  { deep: true }
);



 

const openCreate = () => {
  emit("openModal");
}; 

const { can } = useCan();
const menu = useTemplateRef("menu");

const selected = ref<User | null>(null);
const toggle = (event: MouseEvent, data: User) => {
  selected.value = data;

  nextTick(() => {
    if (menu.value) {
      menu.value!.toggle(event);
    }
  });
};

const menuItems = computed(() => {
  const items = [];

  if (can("hris:company.update")) {
    items.push({
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        emit("openModal", selected.value);
      },
    });
  }

  if (can("hris:company.delete")) {
    items.push({
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        if (selected.value) {
          emit("delete", selected.value.id!);
        }
      },
    });
  }

  return [
    {
      label: "Options",
      items,
    },
  ];


  
});


const onPage = async (event: DataTablePageEvent) => {
  params.value.page.number = event.page + 1;
  params.value.page.size = event.rows;

  await  loadUsers();
};

const onSort = async (event: DataTableSortEvent) => {
  params.value.sort = `${event.sortOrder && event.sortOrder > 0 ? "" : "-"}${
    event.sortField
  }`;
  await loadUsers();
};

const onFilter = async (event: DataTableFilterEvent) => {
  const eFilters = event.filters as UserFilters;
console.log(event);
  for (const k in eFilters) {
    const key = k as keyof UserFilters;
    

    if (eFilters[key].value === null || eFilters[key].value === "") {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete params.value.filter[key];
    } else {
      params.value.filter[key] = eFilters[key].value;
    }
  }

  // set page to 1
  params.value.page.number = 1;

  await loadUsers();
};

 



const loadUsers = useDebounceFn(async () => {
  loading.value = true;
  await userStore.fetchUsers(params.value);
  loading.value = false;
}, 300);

defineExpose({
  loadUsers,
});

</script>

<template>
  <div class="card">
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="users"
      data-key="id"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 25]"
      :total-records="pagination.total"
      :global-filter-fields="['q']"
      lazy
      filter-display="menu"
      current-page-report-template="Showing {first} to {last} of {totalRecords} employees "
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      selection-mode="single"
      @page="onPage($event)"
      @sort="onSort($event)"
      @filter="onFilter($event)" 
    >
      <template #header>
        <div class="flex justify-between gap-4">
          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
             <InputText v-model="filters.q.value" class="w-full" placeholder="Search..." />
          </IconField>

          <div class="flex-shrink-0 flex gap-4">
            <Button
              v-if="hasFilters || filters.q.value"
              icon="pi pi-filter-slash"
              severity="secondary"
              label="Clear Filter"
              @click="clearFilters"
            />

            <Button
              icon="pi pi-plus"
              label="Add User"
              class="flex-shrink-0"
              @click="openCreate"
            />
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center justify-center h-64">
          <i class="pi pi-users" style="font-size: 2.5rem" />
          <span v-if="loading">Loading users...</span>
          <span v-else>No users found</span>
        </div>
      </template>
        <Column field="id_num" header="Employee ID #" sortable style="min-width: 12rem">
          <template v-if="loading" #body>
            <Skeleton/>
          </template>
        </Column>
      <Column field="name" header="Name" sortable style="min-width: 12rem">
          <template v-if="loading" #body>
            <Skeleton/>
          </template>
        </Column>
        
        <Column field="username" header="Username" sortable style="min-width: 12rem">
          <template v-if="loading" #body>
            <Skeleton/>
          </template>
        </Column>
        <Column field="email" header="Email" sortable style="min-width: 12rem">
          <template v-if="loading" #body>
            <Skeleton/>
          </template>
        </Column>
        <Column field="roles" header="Role" :sortable="false" show-filter-menu  :show-filter-match-modes="false" style="min-width: 12rem">
          <template #body="{data}">
            <Skeleton  v-if="loading"/>
            <span v-else>{{ data.roles.map((role: any) => role).join(', ') }}</span>
          </template>

                  <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by role" />
        </template>


        </Column>

      
      <Column
        header-style="width: 8rem"
        body-style="text-align:right"
        :pt="{ root: '!py-1.5' }"
      >
        <template #body="{ data }">
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            severity="secondary"
            rounded
            @click="toggle($event, data)"
          />
        </template>
      </Column>
    </DataTable>



    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="{ item }">
        <Button v-if="item.label === 'Edit'" icon="pi pi-pencil" text label="Edit" />
        <Button
          v-else-if="item.label === 'Delete'"
          icon="pi pi-trash"
          text
          severity="danger"
          label="Delete"
        />
      </template>
    </Menu>
  </div>
</template>
