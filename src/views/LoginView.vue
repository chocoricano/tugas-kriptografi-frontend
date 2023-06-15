<template>
  <section class="">
    <div class="px-4 py-5 px-md-5 text-center text-lg-start" style="background-color: hsl(0, 0%, 96%)">
      <div class="container">
        <div class="row gx-lg-5 align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h1 class="my-5 display-3 fw-bold ls-tight">
              Tok-Scrapy <br />
              <span class="text-primary">Your Tokopedia Scraping Solution</span>
            </h1>
            <p style="color: #5f7d5e">
              Welcome to Tok-Scrapy, the perfect solution for all your Tokopedia data scraping needs. Our service allows you to quickly and efficiently gather product, seller, and review data from Tokopedia, all in one convenient place.
            </p>
          </div>

          <div class="col-lg-6 mb-5 mb-lg-0">
            <div class="card">
              <div class="card-body py-5 px-md-5">
                <form @submit.prevent="submitForm">
                  <div class="form-outline mb-4">
                    <label class="form-label" for="username">Username</label>
                    <input type="text" id="username" class="form-control" v-model="username" placeholder="Enter your username" autofocus>
                  </div>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" class="form-control" v-model="password" placeholder="Enter your password">
                  </div>

                  <div v-if="otpSent" class="form-outline mb-4">
                    <label class="form-label" for="otp">OTP</label>
                    <input type="text" id="otp" class="form-control" v-model="otp" placeholder="Enter the OTP sent to your email">
                  </div>

                  <button type="submit" class="btn btn-primary btn-block mb-4">{{ otpSent ? 'Verify OTP' : 'Login' }}</button>

                  <div v-if="message" class="text-center mt-3">
                    <p>{{ message }}</p>
                  </div>
                </form>
                <div class="mt-4 text-center">
                <router-link to="/register">If you don't have an account, please register</router-link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import axios from 'axios';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const otp = ref('');
const otpSent = ref(false);
const message = ref('');

async function submitForm() {
  try {
    // Show loading dialog
    Swal.fire({
      title: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    if (!otpSent.value) {
      const response = await axios.post('https://103.175.218.179:8181/login', {
        username: username.value,
        password: password.value,
      });

      // Close loading dialog
      Swal.close()

      if (response.data.message == "OTP sent to your email") {
        otpSent.value = true;
        message.value = 'OTP sent! Please enter OTP.';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Username or password is incorrect!",
        })
      }
    } else {
      const response = await axios.post('https://103.175.218.179:8181/verify_login', {
        username: username.value,
        otp: otp.value,
      });

      // Close loading dialog
      Swal.close()

      if (response.data.token) {
        const token = response.data.token;

        // Save token in local storage
        localStorage.setItem('jwt', token);

        // Redirect to the desired page after successful login
        router.push('/');
        message.value = 'Login successful!';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "OTP is incorrect!",
        })
      }
    }
  } catch (error) {
    // Close loading dialog
    Swal.close()

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Something went wrong!",
    })
  }
}
</script>


<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8; /* Set the background color to a light grey */
}

.container {
  width: 100%;
  max-width: 960px;
}

h1, .form-label {
  color: #5f7d5e; /* Change the color of the h1 and form labels to a Tokopedia green */
}

.btn-primary {
  background-color: #5f7d5e; /* Change the background color of the button to the same green */
  border-color: #5f7d5e; /* Also change the border color */
}

.btn-primary:hover {
  background-color: #4f6d4e; /* Slightly darken the button on hover */
  border-color: #4f6d4e;
}

.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); /* Optional: Add a shadow to the card for more depth */
}
</style>
