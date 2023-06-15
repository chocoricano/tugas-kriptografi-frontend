<template>
  <div>
    <nav class="navbar navbar-light" style="background-image: linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb);">
      <div class="container-fluid">
        <div class="p-2 ml-auto">
          <button @click="handleLogout" class="btn btn-danger">Logout</button>
        </div>
      </div>
    </nav>
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="text-center mb-4">
            <h1 class="display-4">Tokopedia Scraper</h1>
          </div>
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="form-group">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="toko" placeholder="Enter Toko Name" autofocus>
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-primary">Scrape</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div v-if="message" class="text-center">
            <h2 class="mt-4">Response:</h2>
            <p>{{ message }}</p>
            <div class="btn-group mt-3 d-flex flex-wrap justify-content-center" role="group" aria-label="Download options">
              <button @click="downloadFile(1)" class="btn btn-success mx-2 my-1">Download as JSON</button>
              <button @click="downloadFile(2)" class="btn btn-success mx-2 my-1">Download as CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
const token = localStorage.getItem('jwt');
const toko = ref('');
const message = ref('');
function isJwtExist() {
  const jwt = localStorage.getItem('jwt');
  return jwt !== null;
}

// Function to handle logout
function handleLogout() {
  localStorage.removeItem('jwt');
  // Perform any additional logout actions if needed
  // Redirect the user
  window.location.href = '/login';
}

async function submitForm() {
  try {
    const response = await axios.post('https://103.175.218.179:8181/scrape', {
      toko: toko.value,
      file: 1,
      data: 1,
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    if (response.data.error === 'File not found') {
      throw new Error('Failed to scrape products.');
    }

    message.value = 'Scraping completed successfully.';
  } catch (error) {
    message.value = 'Error: ' + (error.response ? error.response.data : error.message);
    // Add notification for failed product scrape
    showNotification('Failed to scrape products. Please try again.');
  }
}


async function downloadFile(format) {
  try {
    const response = await axios.post('https://103.175.218.179:8181/scrape', {
      toko: toko.value,
      file: 1,
      data: 1,
    }, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
    );

    let responseData = response.data;
    if (format === 2) {
      responseData = jsonToCsv(responseData);
    } else {
      responseData = JSON.stringify(responseData);
    }

    const blob = new Blob([responseData], { type: format === 1 ? 'application/json' : 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.' + (format === 1 ? 'json' : 'csv'));
    document.body.appendChild(link);
    link.click();

    message.value = 'Download should start soon';
  } catch (error) {
    message.value = 'Error: ' + (error.response ? error.response.data : error.message);
  }
}

function jsonToCsv(json) {
  const keys = Object.keys(json[0]);
  const csvArray = json.map(row => keys.map(key => row[key]));
  csvArray.unshift(keys);
  return csvArray.map(row => row.join(',')).join('\n');
}
</script>

<style scoped>
.container {
  height: 100vh;
}

.navbar {
  border-bottom: 1px solid #ddd;
}

.card {
  border-radius: 15px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
</style>
