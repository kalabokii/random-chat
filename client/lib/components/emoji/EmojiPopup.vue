<script setup lang="ts">
/**
 * Emoji Picker
 * Load emojis and  categories from the json file 'emojis-data.json'
 * Events:
 *  - 'emoji_click' event is fires when the user clicks on an emoji. The emoji is sent as event payload.
 * Props:
 * 	- 'show_arrow' boolean to show or not the arrow at the bottom of the picker. True by default.
 */

import data from "./emojis-data.json";

defineProps({
  show_arrow: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const categories = Object.keys(data);

const category_emojis = (category: string): any[] => {
  // @ts-ignore
  return Object.values(data[category]);
};

const emit = defineEmits(["emoji_click"]);

function handleEmojiClick(e: MouseEvent, emoji: string) {
  e.preventDefault();
  emit("emoji_click", emoji);
}
</script>

<template>
  <div class="emoji_picker">
    <div class="picker_container">
      <div
        class="category text-gray-300"
        v-for="category in categories"
        :key="`category_${category}`"
      >
        <span>{{ category }}</span>
        <div class="emojis_container">
          <button
            v-for="(emoji, index) in category_emojis(category)"
            @click="handleEmojiClick($event, emoji)"
            :key="`emoji_${index}`"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji_picker {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 20rem;
  height: 20rem;
  max-width: 100%;
}

.emoji_picker,
.picker_container {
  border-radius: 0.5rem;
}

.picker_container {
  position: relative;
  padding: 1rem;
  overflow: auto;
  z-index: 1;
}

.category {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.emojis_container {
  display: flex;
  flex-wrap: wrap;
}

.category button {
  margin: 0.5rem;
  margin-left: 0;
  background: inherit;
  border: none;
  font-size: 1.75rem;
  padding: 0;
}
</style>
