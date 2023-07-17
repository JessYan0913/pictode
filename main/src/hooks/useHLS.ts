import { onMounted, onUnmounted, ref } from 'vue';
import HLS from 'hls.js';

export const useHLS = (videoElement?: HTMLVideoElement) => {
  const hls = ref<HLS>(new HLS());

  onMounted(() => {
    if (!videoElement) {
      return;
    }
    hls.value.attachMedia(videoElement);
  });

  onUnmounted(() => {
    hls.value.destroy();
  });

  const loadSource = (src: string) => {
    if (HLS.isSupported()) {
      hls.value.loadSource(src);
    }
  };

  return {
    loadSource,
  };
};

export default useHLS;
