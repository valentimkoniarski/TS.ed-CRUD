<template>
  <div class="q-pa-md">
    <q-page>
      <q-card class="q-card--bordered q-ma-md">
        <q-card-section>
          <div class="q-gutter-md">
            <h2 class="text-h6 q-mb-md">Register</h2>
            <q-input
              v-model="name"
              :rules="[nameRule]"
              id="name-register"
              filled
              standout
              label="Name"
              dense
            />
            <q-input
              v-model="username"
              :rules="[usernameRule]"
              id="username-register"
              filled
              standout
              label="Username"
              dense
            />
            <q-input
              v-model="password"
              :rules="[passwordRule]"
              filled
              standout
              label="Password"
              dense
              type="password"
            />
            <q-input
              v-model="passwordConfirm"
              :rules="[passwordConfirmRule]"
              filled
              standout
              label="Password"
              dense
              type="password"
            />
            <div class="row">
              <div class="col-12 btn-actions-container">
                <q-btn
                  color="primary"
                  label="register"
                  @click="registerUser"
                  :disable="!isFormValid()"
                  class="q-ma-md custom-button"
                  rounded
                  size="md"
                  glossy
                >
                  <q-icon name="login" left />
                </q-btn>
                <q-btn
                  color="secondary"
                  label="redirect to login"
                  @click="redirectToLogin"
                  class="q-ma-md"
                  rounded
                  size="md"
                  glossy
                >
                  <q-icon name="login" left />
                </q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { register } from '../../services/auth/auth.service';
import { UserRegister } from 'src/models/UserRegister';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const name = ref('');
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const router = useRouter();

const nameRule = (val) => {
  if (val.length < 6) {
    return 'Name must be at least 6 characters';
  } else if (val.length > 30) {
    return 'Name must be less than 30 characters';
  }
  return true;
};

const usernameRule = (val) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(val)) {
    return 'Username must be a valid email address';
  }
  return true;
};

const passwordRule = (val) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}:<>?/.,;[\]-]{6,}$/;
  if (!passwordRegex.test(val)) {
    return 'Password must be at least 6 characters, alphanumeric, and contain at least one number and one letter';
  }
  return true;
};

const passwordConfirmRule = (val) => {
  if (val !== password.value) {
    return 'Password must be equal to password confirm';
  }
  return true;
};

const isFormValid = () => {
  return (
    usernameRule(username.value) === true &&
    nameRule(name.value) === true &&
    passwordRule(password.value) === true &&
    passwordConfirmRule(passwordConfirm.value) === true
  );
};

const redirectToLogin = () => {
  router.push('/login');
};

const registerUser = async () => {
  loading.value = true;
  const user: UserRegister = {
    name: name.value,
    username: username.value,
    password: password.value,
  };
  register(user)
    .then(() => {
      router.push('/login');
      Notify.create({
        message: 'User register successfully',
        color: 'positive',
        icon: 'check',
        position: 'bottom',
      });
    })
    .catch((error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.btn-actions-container {
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
