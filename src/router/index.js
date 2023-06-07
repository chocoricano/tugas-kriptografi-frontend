import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuthStatus();

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If the route requires authentication and the user is not authenticated, redirect to the login page
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    // If the user is already authenticated and tries to access the login page, redirect to the home page
    next({ name: 'home' });
  } else {
    // Proceed to the requested route
    next();
  }
});

async function checkAuthStatus() {
  const token = localStorage.getItem('jwt');
  let message = '';

  if (token) {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const username = response.data.username;
      message = 'Valid token for user: ' + username;
      console.log(message);
      return true;
    } catch (error) {
      localStorage.removeItem('jwt');
      message = 'Invalid token. Please login again.';
      console.error(message);
      return false;
    }
  }

  return false;
}

export default router;
