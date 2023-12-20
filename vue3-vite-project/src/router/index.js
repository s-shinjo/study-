import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/register', component: () => import('../views/Register.vue') },
    { path: '/record', component: () => import('../views/Record.vue'), meta: { requiresAuth: true } },
    { path: '/feed', component: () => import('../views/Feed.vue'), meta: { requiresAuth: true } },
    { path: '/sign-in', component: () => import('../views/SignIn.vue') },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeLintener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeLintener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(recode => recode.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
