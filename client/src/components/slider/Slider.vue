<script lang="ts" setup>
import { PropType, ref, watchEffect } from "vue";

const props = defineProps({
  current: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  type: {
    type: String as PropType<"default" | "time">,
    required: false,
    default: "default",
  },
});

const grabber = ref<HTMLElement | null>(null);
const slider = ref<HTMLElement | null>(null);

const progress = ref();

const emit = defineEmits<{
  (e: "update:value", v: number): void;
}>();

const stamps = ref({
  current: "",
  total: "",
});

function handleGrab() {
  const sliderRect = slider.value?.getBoundingClientRect();
  if (!sliderRect) return;
  const width = sliderRect.width;
  const leftX = sliderRect.left;

  let deviation = 0;

  function handleMove(event: MouseEvent) {
    deviation = event.clientX - leftX;
    const percentage = (deviation / width) * 100;
    progress.value = Math.min(100, Math.max(0, percentage));
  }

  document.addEventListener("mousemove", handleMove);

  document.addEventListener("mouseup", () => {
    emit("update:value", (progress.value * props.total) / 100);
    document.removeEventListener("mousemove", handleMove);
  });
}

watchEffect(() => {
  progress.value = (props.current / props.total) * 100;
});

function handleSliderClick(event: MouseEvent) {
  const sliderRect = slider.value?.getBoundingClientRect();
  if (!sliderRect) return;
  const width = sliderRect.width;
  const leftX = sliderRect.left;

  const deviation = event.clientX - leftX;
  const percentage = (deviation / width) * 100;
  progress.value = Math.min(100, Math.max(0, percentage));
  emit("update:value", (progress.value * props.total) / 100);
}

watchEffect(() => {
  if (props.type === "time") {
    stamps.value.current =
      Math.floor((props.total * progress.value) / 100 / 60) +
      ":" +
      (((props.total * progress.value) / 100) % 60).toFixed(0);
    stamps.value.total =
      Math.floor(props.total / 60) + ":" + (props.total % 60).toFixed(0);
  } else {
    stamps.value.current = props.current.toString();
    stamps.value.total = props.total.toString();
  }
});
</script>

<template>
  <div
    ref="slider"
    class="flex h-1 mt-2 bg-blue-300/30 items-center justify-start"
    @click="handleSliderClick"
  >
    <div :style="`width: ${progress}%`" class="h-full bg-blue-300"></div>
    <div
      ref="grabber"
      class="cursor-pointer rounded-full h-2 w-2 bg-blue-300"
      @mousedown="handleGrab"
    ></div>
  </div>
  <div class="flex justify-between items-center mt-1">
    <p class="select-none text-xs text-gray-500">{{ stamps.current }}</p>
    <p class="select-none text-xs text-gray-500">{{ stamps.total }}</p>
  </div>
</template>
