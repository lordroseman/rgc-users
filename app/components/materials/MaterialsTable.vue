<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

const customers = ref();
const selectedCustomers = ref();
const filters = ref(); 

const categories = ref([
  { name: "Electronics" },
  { name: "Furniture" },
  { name: "Clothing" },
  { name: "Food" },
  { name: "Books" },
]);
 

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

initFilters();

 
const formatCurrency = (value: number) => {
  return  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP"}).format(value);  
};

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
      filter-display="menu"
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
              label="Add Material"
              icon="pi pi-plus"
              class="p-button-success    mr-2 flex-shrink-0" 
              @click="showModal = true"
            />
        </div>
        </div>
      </template>
      <template #empty> No materials found. </template> 
      <Column field="item_code" header="Item Code" sortable style="min-width: 14rem">
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
        header="Category"
        sortable
        sort-field="category.name"
        filter-field="category.name"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <span>{{ data.category.name }}</span>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="categories"
            option-label="name"
            placeholder="Any"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        field="units_type"
        header="Units Type"
        sortable
        filter-field="units_type"
        data-type="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ data.units_type }}
        </template>
        
      </Column>
        <Column
        field="stock_unit"
        header="Stock Unit"
        sortable
        filter-field="stock_unit"
        data-type="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ data.stock_unit }}
        </template>
        
      </Column>

        <Column
        field="purchase_unit"
        header="Purchase Unit"
        sortable
        filter-field="purchase_unit"
        data-type="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ data.purchase_unit }}
        </template>
        
      </Column>
      <Column
        field="price"
        header="Price"
        sortable
        filter-field="price"
        data-type="numeric"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatCurrency(data.price) }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            v-model="filterModel.value"
            mode="currency"
            currency="PHP"
            locale="en-US"
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
    <MaterialModal v-model="showModal" />
  </div>
</template>
