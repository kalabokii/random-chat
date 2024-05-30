<script setup lang="ts"></script>

<template>
  <div class="py-4 bg-gray-800 flex px-10">
    <h3>
      <router-link
        :to="{ name: 'home' }"
        class="text-white hover:text-gray-300"
      >
        <p class="text-lg font-medium font-mono tracking-widest">Xod-Chat</p>
      </router-link>
    </h3>
  </div>
</template>
