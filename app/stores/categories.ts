import { defineStore } from "pinia";
import type { Category } from "~/types/common";

export const useCategoriesStore = defineStore('categories', () => {

    const categories = ref<Category[]>([]);
    const categoriesLoaded = ref(false);
    const isLoading = ref(false);

    const config = useRuntimeConfig();

    const fetchCategories = async () => {
        try {
            isLoading.value = true;
            const response = await useAuthFetch<Category[]>(config.public.warehouseApiUrl + '/api/categories');
            categories.value = response.data || [];
            categoriesLoaded.value = true;
            isLoading.value = false;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            isLoading.value = false;
        }
    };

    return {
        categories,
        categoriesLoaded,
        isLoading,
        fetchCategories
    };

    
});