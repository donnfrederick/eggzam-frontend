<script setup lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { RouterView } from 'vue-router';
  import Header from './components/Header.vue';
</script>

<template>
  <div id="vue-app">
      <Header />
      <div class="container-body">
        <router-view />
      </div>
  </div>
</template>

<style>
body {
    background: #000;
    color: #6C7293;
}
</style>