import { isRef, onMounted, onUnmounted, Ref, unref, watch } from 'vue';

type EventMap = HTMLElementEventMap & DocumentEventMap & WindowEventMap & MediaQueryListEventMap;

export const useEventListener = <K extends keyof EventMap>(
  target: Ref<EventTarget | null> | EventTarget,
  event: K,
  handler: (event: EventMap[K]) => void
) => {
  const eventHandler = (event: Event) => {
    handler(event as EventMap[K]);
  };
  if (isRef(target)) {
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(event, eventHandler);
      value?.addEventListener(event, eventHandler);
    });
  } else {
    onMounted(() => {
      target.addEventListener(event, eventHandler);
    });
  }

  onUnmounted(() => {
    unref(target)?.removeEventListener(event, eventHandler);
  });
};

export default useEventListener;
