<script setup>
import { RouterLink, RouterView } from 'vue-router'

// Function to check if JWT exists in local storage
function isJwtExist() {
  const jwt = localStorage.getItem('jwt');
  return jwt !== null;
}

// Function to handle logout
function handleLogout() {
  localStorage.removeItem('jwt');
  // Perform any additional logout actions if needed
}
</script>

<template>
  <div>
   
  </div>
  <RouterView />
</template>

<style scoped>


</style>
