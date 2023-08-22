<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid';

import Dialog from '@/components/Dailog.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import Switch from '@/components/Switch.vue';
import usePictode from '@/hooks/usePictode';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const { app } = usePictode();

const dialogVisible = computed<boolean>({
  get() {
    return props.visible;
  },
  set(visible: boolean) {
    emits('update:visible', visible);
    if (!visible) {
      emits('close');
    }
  },
});

const enabled = ref<boolean>(false);
const pixelRatio = ref<number>(2);

const people = [{ name: 'PNG' }, { name: 'SVG' }, { name: 'JPG' }];
const selectedPerson = ref(people[0]);

const imgSrc = ref<string>('https://i.imgur.com/RWYeUDM.png');

const closeModal = () => {
  dialogVisible.value = false;
};

const updateImgSrc = async () => {
  imgSrc.value = await app.toDataURL();
};

onMounted(() => {
  updateImgSrc();
});
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <div class="flex items-center h-96 w-[50%]">
      <div
        class="w-full h-full flex flex-grow justify-center bg-fixed rounded-md p-1"
        style="
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);
        "
      >
        <img :src="imgSrc" />
      </div>
    </div>
    <div class="flex flex-col flex-wrap gap-6 grow ml-6 antialiased">
      <div class="text-lg">导出图片</div>
      <div class="flex flex-row justify-between items-center">
        <label>背景</label>
        <Switch v-model="enabled"></Switch>
      </div>
      <div class="flex flex-row justify-between items-center">
        <label>缩放比</label>
        <RadioGroup v-model="pixelRatio" class="rounded ring-1 ring-black ring-opacity-5 p-0.5" @change="updateImgSrc">
          <RadioGroupOption :value="1" class="font-mono text-xs">{{ '1x' }}</RadioGroupOption>
          <RadioGroupOption :value="2" class="font-mono text-xs">{{ '2x' }}</RadioGroupOption>
          <RadioGroupOption :value="3" class="font-mono text-xs">{{ '3x' }}</RadioGroupOption>
        </RadioGroup>
      </div>
      <div class="flex flex-row justify-between items-center">
        <label>图片格式</label>
        <Listbox v-model="selectedPerson" class="w-24">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full cursor-default rounded ring-1 ring-black ring-opacity-5 p-0.5 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">{{ selectedPerson.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="person in people"
                  :key="person.name"
                  :value="person"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-blue-100' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ person.name }}</span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="grow flex flex-col justify-end">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-blue-400 text-blue-50"
        >
          下载
        </button>
      </div>
    </div>
  </Dialog>
</template>
