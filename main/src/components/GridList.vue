<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useVirtualGridList } from '@/hooks/useVirtualGridList';

export interface Pagination {
  limit: number;
  page: number;
}

export interface RequestResult<T> {
  data: T[];
  total: number;
}

export type RequestFunc<T> = (pagination: Pagination) => Promise<RequestResult<T>> | RequestResult<T>;

const props = withDefaults(
  defineProps<{
    dataSource?: any[];
    request?: RequestFunc<any>;
    limit?: number;
    itemMinWidth?: number | string;
    itemMinHeight?: number | string;
    rowGap?: number | string;
    columnGap?: number | string;
    loadDistance?: number;
  }>(),
  {
    dataSource: () => [],
    limit: 50,
    request: () => ({
      data: [],
      total: 0,
    }),
    itemMinWidth: 200,
    itemMinHeight: 200,
    rowGap: 0,
    columnGap: 0,
    loadDistance: 0,
  }
);

const emit = defineEmits<{
  (event: 'onSelectChange', value: any): void;
}>();

const containerRef = ref<HTMLDivElement>();
const loading = ref<boolean>(false);
const data = ref<any[]>([]);
const total = ref<number>(0);
const page = ref<number>(1);
/** 没有更多了 */
const noMore = computed<boolean>(
  () => total.value === 0 || data.value.length >= total.value || data.value.length < props.limit
);
/** 计算最小宽度的像素值 */
const itemMinWidth = computed<number>(() => convertToPixels(props.itemMinWidth));
/** 计算最小高度的像素值 */
const itemMinHeight = computed<number>(() => convertToPixels(props.itemMinHeight));
/** 计算列间距的像素值 */
const columnGap = computed<number>(() => convertToPixels(props.columnGap));
/** 计算行间距的像素值 */
const rowGap = computed<number>(() => convertToPixels(props.rowGap));
/** 计算虚拟列表的起始/终止索引 */
const { startIndex, endIndex, startOffset, listHeight } = useVirtualGridList({
  containerRef,
  data,
  itemMinWidth,
  itemMinHeight,
  columnGap,
  rowGap,
});

watch(
  () => props.dataSource,
  (dataSource) => {
    data.value = [...dataSource];
  },
  { immediate: true }
);

watch(
  () => props.request,
  () => {
    load();
  },
  { immediate: true }
);

function handleScroll(event: Event) {
  event.preventDefault();
  const container = event.target as HTMLDivElement;
  const canLoad =
    container.scrollTop + container.clientHeight >= container.scrollHeight - props.loadDistance &&
    !loading.value &&
    !noMore.value;
  if (canLoad) {
    load();
  }
}

async function load() {
  loading.value = true;
  const result = await Promise.resolve(
    props.request({
      limit: props.limit,
      page: page.value,
    })
  );

  total.value = result.total;
  data.value.push(...result.data);
  if (!noMore.value) {
    page.value = page.value + 1;
  }
  loading.value = false;
}

function convertToPixels(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }
  if (!containerRef.value) {
    return 0;
  }
  let shadowDiv: HTMLDivElement | null = containerRef.value.querySelector('#shadow');
  if (!shadowDiv) {
    shadowDiv = document.createElement('div');
    shadowDiv.style.position = 'absolute';
    shadowDiv.style.visibility = 'hidden';
    containerRef.value.appendChild(shadowDiv);
  }
  shadowDiv.style.width = value;
  const computedStyle = getComputedStyle(shadowDiv);
  const pixels = parseFloat(computedStyle.width);
  return pixels;
}
</script>

<template>
  <div ref="containerRef" class="infinite-list-wrapper" @scroll="handleScroll">
    <div v-if="data.length === 0 && !loading">
      <slot name="empty">No Data</slot>
    </div>
    <div v-else class="list">
      <div v-for="(item, index) in data.slice(startIndex, endIndex)" :key="index" @click="emit('onSelectChange', item)">
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
    </div>
    <div v-if="loading" class="bottom">
      <slot name="loading"></slot>
    </div>
    <div v-if="noMore && data.length > 0" class="bottom">
      <slot name="noMore"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.infinite-list-wrapper {
  text-align: center;
  overflow-y: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(v-bind(itemMinWidth) * 1px), 1fr));
    grid-auto-rows: minmax(auto, calc(v-bind(itemMinHeight) * 1px));
    column-gap: calc(v-bind(columnGap) * 1px);
    row-gap: calc(v-bind(rowGap) * 1px);
    transform: translate3d(0, calc(v-bind(startOffset) * 1px), 0);

    div:first-of-type {
      grid-column-start: 1;
      grid-column-end: 1;
    }
  }
}

.bottom {
  width: 100%;
  position: absolute;
  top: calc(v-bind(listHeight) * 1px);
}
</style>
