<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
import { computed, ref, useTemplateRef, watch } from "vue";

interface Props {
  start?: string | Date | null;
  end?: string | Date | null;
  error?: string | string[] | null;
  label?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  start: null,
  end: null,
  error: null,
  label: "Date Period",
  id: "company",
});
const emit = defineEmits(["update:start", "update:end", "dateSelectChange"]);

const dates = ref();

watch(dates, (val) => {
  if (Array.isArray(val)) {
    emit("update:start", val[0]);
    emit("update:end", val[1]);
  }
});

watch(
  [() => props.start, () => props.end],
  () => {
    dates.value = [props.start, props.end];
  },
  { immediate: true }
);

const op = useTemplateRef("op");

const selectedDate = computed(() => {
  if (Array.isArray(dates.value)) {
    const date1 = useDateFormat(dates.value[0], "MM/DD/YYYY").value;
    const date2 = useDateFormat(dates.value[1], "MM/DD/YYYY").value;

    const isValidDate1 = !date1.includes("NaN");
    const isValidDate2 = !date2.includes("NaN");

    if (isValidDate1 && isValidDate2) {
      return `${date1} - ${date2}`;
    }
  }
  return "";
});

const selectedDateOption = ref();
const dateOptions = ref([
  { name: "Payroll cut-off for the 15th of the Month", code: "payroll15th" },
  { name: "Payroll cut-off for the End of the Month", code: "payrollEnd" },
  { name: "This Month", code: "thisMonth" },
  { name: "Custom Date range", code: "custom" },
]);

watch(selectedDateOption, (val) => {
  if (val.code === "payroll15th") {
    let month = new Date().getMonth() - 1;
    let year = new Date().getFullYear();
    if (month < 0) {
      month = 11;
      year = year - 1;
    }

    dates.value = [
      new Date(year, month, 21),
      new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    ];
  } else if (val.code === "payrollEnd") {
    dates.value = [
      new Date(new Date().getFullYear(), new Date().getMonth(), 6),
      new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    ];
  } else if (val.code === "thisMonth") {
    dates.value = [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ];
  } else {
    dates.value = [new Date(), new Date()];
  }
});

const setToCustom = () => {
  selectedDateOption.value = dateOptions.value.find((option) => option.code === "custom");
};

onMounted(() => {
     selectedDateOption.value = dateOptions.value.find((option) => option.code === "payroll15th"); 

  // setToCustom();
});
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <InputText
      :id="id"
      :model-value="selectedDate"
      :invalid="!!error"
      class="w-full"
      readonly
      @click="(e) => op?.toggle(e)"
    />

    <Popover ref="op">
      <div class="flex gap-2">
        <div>
          <Listbox
            v-model="selectedDateOption"
            :options="dateOptions"
            option-label="name"
            :pt="{ root: '!border-0 !shadow-none' }"
            class="w-full md:w-56"
          />
        </div>
        <DatePicker
          v-model="dates"
          selection-mode="range"
          :number-of-months="2"
          :manual-input="false"
          :invalid="!!error"
          :inline="true"
          @value-change="setToCustom"
          @date-select="emit('dateSelectChange')"
        />
      </div>
    </Popover>
  </div>
</template>
