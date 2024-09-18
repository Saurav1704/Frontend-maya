import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import WelcomePage from '@/views/WelcomePage.vue';  // Import the WelcomePage component

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/Main/MAYA',  // Redirect root path to the welcome page
  },
  {
    path: '/Main/MAYA',
    component: WelcomePage,  // Load the WelcomePage component for the /Main/MAYA route
  },
  {
    path: '/Main/:id',
    component: () => import ('../views/Home.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
