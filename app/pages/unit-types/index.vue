<script setup lang="ts">


useHead({
  title: 'Unit Types'
})


const home = ref({
  icon: "pi pi-home",
});
const items = ref([{ label: "Materials" }]);



 
onMounted(() => {
  
});
</script>

<template>
  <div class="bg-white">
    <Breadcrumb :home="home" :model="items" />
    <h1 class="text-lg md:text-2xl font-medium ml-4">Unit Types</h1> 
   
    <div>
        <UnitTypesTable /> 
    </div>
  </div>
</template>
