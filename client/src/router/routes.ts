import {
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';
import { userInfo } from 'src/services/auth/auth.service';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await userInfo();
    return response.status === 200;
  } catch (error) {
    errorRequestNotificationUtil(error);
    return false;
  }
}

async function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> {
  if (await isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
}
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('components/auth/LoginComponent.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('components/auth/LoginComponent.vue'),
      },
      {
        path: '/validate-account',
        name: 'validateUser',
        component: () => import('components/auth/ActiveAccountComponent.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('components/auth/RegisterComponent.vue'),
      },
    ],
  },
  {
    path: '/homepage',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/HomePage.vue') },
      {
        path: 'edit-product/:id',
        name: 'editProduct',
        component: () => import('components/products/EditProductComponent.vue'),
      },
      {
        path: 'create-product',
        name: 'createProduct',
        component: () =>
          import('components/products/CreateProductComponent.vue'),
      },
    ],
    beforeEnter: requireAuth,
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/errors-page/ErrorNotFound.vue'),
  },
  {
    path: '/error-network',
    name: 'errorNetwork',
    component: () => import('pages/errors-page/ErrorNetwork.vue'),
  },
];

export default routes;
