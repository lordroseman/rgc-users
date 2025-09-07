<script setup lang="ts">

useHead({
  title: 'Materials'
})

const home = ref({
  icon: "pi pi-home",
});
const items = ref([{ label: "Materials" }]);

 

const config = useRuntimeConfig();
onMounted(() => {
  // Initialize or fetch data if needed
  const data  = useAuthFetch(config.public.warehouseApiUrl + "/api/materials");
  console.log(data);
});
</script>

<template>
  <div class="bg-white">
    <Breadcrumb :home="home" :model="items" />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Materials</h1> 
   
    <div>
        <MaterialsTable /> 
    </div>
  </div>
</template>
