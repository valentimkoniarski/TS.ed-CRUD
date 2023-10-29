<template>
  <q-layout view="lHh Lpr lFf" class="login-page" style="padding-top: 100px">
    <q-header elevated class="bg-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" color="dark" />

        <q-toolbar-title class="text-dark" @click="toHomepage()">
          <span class="cursor-pointer">Ts.ed-CRUD</span>
        </q-toolbar-title>

        <q-avatar size="md" class="q-mr-sm" color="primary" text-color="white">
          <q-icon name="person" />
          <q-menu cover anchor="top right" transition-show="slide-up">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section @click="doLogout()">Logout</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Settings</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-page-container class="custom-page-container">
      <div class="q-gutter-md custom-content">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout } from 'src/services/auth/auth.service';

const router = useRouter();

const doLogout = () => {
  logout();
  router.push('/login');
};

const toHomepage = () => {
  router.push('/homepage');
};
</script>

<style scoped>
.login-page {
  background-size: cover;
  background: linear-gradient(45deg, #26a69a, #285928) no-repeat center;
  overflow-x: hidden;
}

.custom-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-content {
  max-width: 1300px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .custom-content {
    max-width: 100%;
  }
}
</style>
