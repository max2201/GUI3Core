<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  margin-top: 60px;
}

:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --text-color: #2c3e50;
  --background-color: #ffffff;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
}

#app div::-webkit-scrollbar,
ul::-webkit-scrollbar {
  width: 15px;
  height: 15px;
  background-color: var(--background-color);
}

#app div::-webkit-scrollbar-track,
ul::-webkit-scrollbar-track {
  background-color: var(--background-color);
  border-radius: 8px;
}

#app div::-webkit-scrollbar-thumb,
ul::-webkit-scrollbar-thumb {
  background: #cad2d7;
  border-radius: 8px;
  border: 5px solid var(--background-color);
  width: 15px;
}

#app div::-webkit-scrollbar-thumb:hover,
ul::-webkit-scrollbar-thumb:hover {
  background: var(--text-color);
}
</style>
