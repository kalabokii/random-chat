<script setup lang="ts">
import Page from "./components/page/Page.vue";
// import Header from "./components/page/Header.vue";
import PageBody from "./components/page/PageBody.vue";
</script>

<template>
  <Page>
    <!--    <Header></Header>-->
    <PageBody>
      <router-view />
    </PageBody>
  </Page>
</template>
