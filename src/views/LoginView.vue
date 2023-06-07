<template>
    <div class="container py-5">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="text-center mb-4">
            <h1 class="display-4">Login</h1>
          </div>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" class="form-control" v-model="username" placeholder="Enter your username" autofocus>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" v-model="password" placeholder="Enter your password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <div v-if="message" class="text-center mt-3">
            <p>{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import router from '../router';

const username = ref('');
const password = ref('');
const message = ref('');

async function submitForm() {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      username: username.value,
      password: password.value,
    });

    if (response.data.token) {
      const token = response.data.token;
      console.log(token);
  
      // Simpan token di local storage
      localStorage.setItem('jwt', token);
  
      // Redirect ke halaman yang diinginkan setelah login berhasil
      router.push('/');
    }

    message.value = 'Login successful!';
  } catch (error) {
    message.value = 'Error: ' + (error.response ? error.response.data : error.message);
  }
}


</script>

