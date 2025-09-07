import type { UnitType } from "~/types";

export const useUnitTypeStore = defineStore('unit-types', () => {
    const config = useRuntimeConfig();

    const unitTypes = ref<UnitType[]>([]);
    const unitTypesLoaded = ref(false);

    const isLoading = ref(false);
    const error = ref<unknown | null>(null);


    const fetchUnitTypes = async () => {
        try {
            isLoading.value = true;
            const response = await useAuthFetch<UnitType[]>(config.public.warehouseApiUrl + '/api/unit-types');
            unitTypes.value = response.data || [];
            unitTypesLoaded.value = true;
        } catch (err) {
            console.error('Failed to fetch unit types:', err);
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        unitTypes,
        unitTypesLoaded,
        isLoading,
        error,
        fetchUnitTypes
    };

   

});