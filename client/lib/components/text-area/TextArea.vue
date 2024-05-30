<script lang="ts" setup>
import { ref, watch } from "vue";

const areaRef = ref<HTMLTextAreaElement | null>(null);
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "submit"): void;
  (e: "focus"): void;
}>();

function handleInputChange() {
  if (areaRef.value?.value) {
    emit("update:modelValue", areaRef.value?.value);
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    emit("submit");
    areaRef.value?.focus();
  }
}

watch(
  props,
  () => {
    if (!areaRef.value) {
      return;
    }
    if (props.modelValue === "") {
      areaRef.value.style.height = "auto";
      return;
    }
    areaRef.value.style.height = "auto";
    areaRef.value.style.height = areaRef.value.scrollHeight + "px";
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div
    class="max-h-72 overflow-auto w-full flex items-center min-h-[3rem]"
    @click="areaRef?.focus()"
  >
    <textarea
      :disabled="disabled"
      @keydown="handleKeyDown"
      :value="modelValue"
      contenteditable="true"
      @input="handleInputChange"
      ref="areaRef"
      :placeholder="placeholder"
      @focus="$emit('focus')"
      cols="20"
      rows="1"
      class="text-gray-300 leading-6 bg-transparent w-full outline-none resize-none"
    ></textarea>
  </div>
</template>
