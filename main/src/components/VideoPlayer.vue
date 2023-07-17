<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

import Mute from '@/assets/img/mute.svg';
import Play from '@/assets/img/play.svg';
import { useHLS } from '@/hooks/useHLS';

export type VideoType =
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'
  | 'application/x-mpegURL'
  | 'application/dash+xml'
  | 'video/x-msvideo'
  | 'video/quicktime'
  | 'video/x-ms-wmv';

export interface Track {
  label: string;
  src: string;
  srclang: string;
  kind: TextTrackKind;
}

const props = defineProps<{
  src: string;
  type: VideoType;
  poster?: string;
  tracks?: Track[];
  showingTrack?: string;
  volume?: number;
}>();

const { loadSource } = useHLS();

const videoRef = ref<HTMLVideoElement>();

const loading = ref<boolean>(true);

watchEffect(() => {
  if (!videoRef.value) {
    return;
  }
  if (videoRef.value.canPlayType(props.type)) {
    videoRef.value.src = props.src;
  } else {
    loadSource(videoRef.value.src);
  }

  Array.from(videoRef.value.textTracks).forEach((track) => {
    if (track.label === props.showingTrack) {
      track.mode = 'showing';
    }
  });
});

const handlePlayOrPause = () => {
  if (!videoRef.value || !loading.value) {
    return;
  }
  if (videoRef.value.paused) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
};

defineExpose({
  pause: () => videoRef.value?.pause(),
  play: () => videoRef.value?.play(),
  fastSeek: (time: number) => videoRef.value?.fastSeek(time),
  canPlayType: (type: string) => videoRef.value?.canPlayType(type),
});
</script>

<template>
  <div class="video-wrapper">
    <video
      ref="videoRef"
      class="video-player"
      preload="auto"
      :controls="false"
      :poster="poster"
      @waiting="loading = true"
      @loadeddata="loading = false"
    >
      <track
        v-for="({ src, kind, srclang, label }, index) in tracks"
        :key="index"
        :src="src"
        :kind="kind"
        :srclang="srclang"
        :label="label"
      />
      <p>你的浏览器不支持 HTML5 视频。可点击<a :href="src">此链接</a>观看</p>
    </video>
    <div class="video-controls">
      <img class="play-pause-button" :src="Play" @click="handlePlayOrPause" />
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <div class="volume-wrapper">
        <img class="mute-button" :src="Mute" />
        <div class="volume-bar">
          <div class="volume-level"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-wrapper {
  position: relative;
}
.video-player {
  width: 100%;
  height: 100%;
  background-color: rgba(32, 32, 32, 0.842);
  &::cue {
    background: none;
    color: rgb(0, 255, 162);
    text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
    font-size: medium;
  }
}
.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  box-sizing: border-box;
}
.play-pause-button {
  width: 40px;
  height: 40px;
  background-color: red;
  border: none;
  outline: none;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
}
.progress-bar {
  flex-grow: 1;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  margin: 0 10px;
  position: relative;
  cursor: pointer;
}
.progress {
  height: 100%;
  background-color: #ffffff;
  width: 20px;
}
.volume-wrapper {
  display: flex;
  align-items: center;
}
.mute-button {
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 5px;
}
.volume-bar {
  width: 60px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  position: relative;
  cursor: pointer;
}
.volume-level {
  height: 100%;
  background-color: #ffffff;
  width: 20%;
}
</style>
