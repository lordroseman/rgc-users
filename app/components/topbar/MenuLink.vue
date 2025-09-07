<script setup lang="ts">
import type { MenuItem } from '~/types/menu';

defineProps<{
  item: MenuItem;
  active?: boolean
}>();
 



</script>

<template>
    <NuxtLink 
        :to="item.to" 
        class="flex items-center p-2 text-base   rounded-lg text-white  hover:bg-gray-700 group" 
        :class="{ 'bg-gray-700': active }">
        <Icon v-if="item.icon" size="24px" :name="item.icon" class="transition duration-75  text-gray-400 group-hover:text-white" />        
        <span class="ml-3">{{  item.label }}</span> 
    </NuxtLink>
</template>