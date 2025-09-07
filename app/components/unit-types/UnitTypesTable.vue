<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode } from "@primevue/core/api";

const customers = ref();
const selectedCustomers = ref();
const filters = ref(); 

 

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
   
  };
};

initFilters();

 
const clearFilter = () => {
  initFilters();
}; 


/**
 *  MODAL
 */
const showModal = ref(false);


</script>

<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedCustomers"
      :value="customers"
      paginator
      :rows="10"
      data-key="id" 
      :global-filter-fields="[
        'name',
        'country.name',
        'representative.name',
        'balance',
        'status', 
      ]"
    >
      <template #header>
 
        <div class="flex justify-between gap-4">
        
          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" class="w-full"/>
          </IconField>

      <div class="flex-shrink-0">
        <Button
              label="Clear Filter"
              icon="pi pi-filter-slash"
              class="p-button-secondary mr-2 flex-shrink-0"
              @click="clearFilter"
            />
        
            <Button
              label="Add Unit Type"
              icon="pi pi-plus"
              class="p-button-success    mr-2 flex-shrink-0" 
              @click="showModal = true"
            />
        </div>
        </div>
      </template>
      <template #empty> 
        <div class="flex flex-col items-center justify-center my-8"> 
          <span class="text-gray-500 font-medium text-lg">Looks a little empty</span>
          <span>Create your first unit type to make inventory tracking easier</span>
             <Button
              label="Add Unit Type"
              icon="pi pi-plus"
              class="p-button-success   mt-4 mr-2 flex-shrink-0" 
              @click="showModal = true"
            />
        </div>
      </template> 
      <Column field="name" header="Name" sortable style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.item_code }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column
        header="Description"
        sortable
        sort-field="description"
        filter-field="description"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <span class="line-clamp-2">{{ data.description }}</span>
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by description"
          />
        </template>
      </Column>
       
      
      <Column
        header-style="width: 5rem; text-align: center"
        body-style="text-align: center; overflow: visible"
      >
        <template #body>
          <Button type="button" icon="pi pi-cog" rounded />
        </template>
      </Column>
    </DataTable> 
    <UnitTypeModal v-model:visible="showModal" />
  </div>
</template>
