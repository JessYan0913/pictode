<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';

const plan = ref('startup');
</script>

<template>
  <h1 class="text-3xl font-bold underline bg-blue-500 hover:bg-sky-700">Hello world!</h1>
  <div class="padding-[20px]">
    <RadioGroup v-model="plan">
      <div class="pictode-radio-group">
        <RadioGroupOption v-slot="{ checked }" value="startup">
          <span :class="['pictode-radio-group-option', checked ? 'checked' : '']">Startup</span>
        </RadioGroupOption>
        <RadioGroupOption v-slot="{ checked }" value="business">
          <span :class="['pictode-radio-group-option', checked ? 'checked' : '']">Business</span>
        </RadioGroupOption>
      </div>
    </RadioGroup>
  </div>
</template>
