<script setup lang="ts">
import EmojiPopup from "./EmojiPopup.vue";
import { Icon } from "@iconify/vue";
import { OnClickOutside } from "@vueuse/components";
import { ref } from "vue";

const isPopupVisible = ref(false);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<(e: "update:modelValue", v: string) => void>();

function handleEmojiClick(emoji: string) {
  emit("update:modelValue", props.modelValue + emoji);
}
</script>

<template>
  <div class="relative w-8 h-8">
    <Icon
      icon="fluent:emoji-laugh-16-regular"
      @click="isPopupVisible = !isPopupVisible"
      class="cursor-pointer text-gray-300 hover:text-blue-400 w-8 h-8"
    />
    <div
      v-if="isPopupVisible"
      @click="isPopupVisible = true"
      class="emoji-cont rounded w-72 h-80 absolute right-0 bg-gray-700 shadow-lg"
    >
      <OnClickOutside @trigger="isPopupVisible = false">
        <EmojiPopup @emoji_click="handleEmojiClick" />
      </OnClickOutside>
    </div>
  </div>
</template>

<style>
.emoji-cont {
  bottom: 2rem;
}
</style>
