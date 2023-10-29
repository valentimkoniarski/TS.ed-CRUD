<template>
  <q-layout view="lHh Lpr lFf" class="login-page">
    <q-page-container class="custom-page-container">
      <div class="q-gutter-md custom-content">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

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
  max-width: 1000px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .custom-content {
    max-width: 100%;
  }
}
</style>
