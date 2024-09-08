<script setup lang="ts" generic="T extends string | number | boolean | Record<string | number, any> | undefined">
import { computed, ref, toRefs, watch } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';

import useTheme from '@/hooks/useTheme';

import { FormValue, RadioGroupConfig } from '../types';

const props = withDefaults(
  defineProps<{
    config: RadioGroupConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  },
);

const emits = defineEmits<(event: 'change', prop: string, value: T) => void>();

const { model, prop } = toRefs(props);
const value = ref<T>(prop?.value && model?.value?.[prop?.value]);
const { theme } = useTheme();
const strokeColor = computed<string>(() => (theme.value === 'dark' ? '#d1d5db' : '#333333'));

watch(
  () => value.value,
  (v) => emits('change', prop.value, v as T),
);

watch(
  () => model.value,
  () => {
    value.value = model?.value?.[prop?.value];
  },
);
</script>

<template>
  <RadioGroup v-model="value">
    <div class="w-full flex justify-start gap-2">
      <RadioGroupOption
        v-for="(option, index) in config.options"
        :key="index"
        :value="option.value"
        :title="$t(option.title ?? '')"
        class="rounded-lg inline-flex items-center relative cursor-pointer select-none"
      >
        <template #default="{ checked }">
          <div
            :class="[
              'rounded-lg inline-flex items-center relative cursor-pointer select-none p-2 text-slate-900 dark:text-gray-300',
              checked ? 'bg-blue-500' : 'hover:bg-gray-200 dark:hover:bg-navyBlue-100',
            ]"
          >
            <iconpark-icon
              v-if="config.optionType === 'icon'"
              :name="option.label"
              :stroke="strokeColor"
            ></iconpark-icon>
            <div v-else :class="option.class">{{ $t(option.label) }}</div>
          </div>
        </template>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
