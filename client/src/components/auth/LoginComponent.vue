<template>
  <div class="q-pa-md">
    <q-page>
      <q-card class="q-card--bordered q-ma-md">
        <q-card-section>
          <div class="q-gutter-md">
            <h2 class="text-h6 q-mb-md">Login</h2>
            <q-input
              v-model="username"
              filled
              standout
              label="Username"
              dense
              :rules="[usernameRule]"
            >
            </q-input>
            <q-input
              v-model="password"
              filled
              standout
              label="Password"
              dense
              type="password"
              :rules="[passwordRule]"
            >
            </q-input>

            <div class="row">
              <div class="col-12 btn-actions-container">
                <q-checkbox
                  label="Remember me"
                  color="primary"
                  dense
                ></q-checkbox>

                <q-btn
                  color="primary"
                  label="Login"
                  @click="submitLogin"
                  :disable="!isFormValid()"
                  class="q-ma-md"
                  rounded
                  size="md"
                  glossy
                >
                  <q-icon name="login" left />
                </q-btn>

                <q-btn
                  color="secondary"
                  label="Register"
                  @click="redirectToRegister"
                  class="q-ma-md"
                  rounded
                  size="md"
                  glossy
                >
                  <q-icon name="person_add" left />
                </q-btn>
              </div>
            </div>

            <q-dialog v-model="loading">
              <q-spinner-gears size="50px" color="primary" />
              <q-spinner-facebook v-if="loading" />
            </q-dialog>
          </div>
        </q-card-section>

        <q-dialog v-model="errorDialog">
          <q-card>
            <q-card-section class="text-h6">
              Oops! Something went wrong.
            </q-card-section>
            <q-card-section>
              <p>{{ errorMessage }}</p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="primary" label="OK" @click="errorDialog = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../../services/auth/auth.service';
import { UserLogin } from 'src/models/UserLogin';
import { useRouter } from 'vue-router';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorDialog = ref(false);
const errorMessage = ref('');
const router = useRouter();

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

const isFormValid = () => {
  return (
    usernameRule(username.value) === true &&
    passwordRule(password.value) === true
  );
};

const submitLogin = () => {
  loading.value = true;

  const userLogin = new UserLogin(username.value, password.value);

  login(userLogin)
    .then((response) => {
      const userInfo = 'Bearer ' + response.data.token;
      localStorage.setItem('token', JSON.stringify(userInfo));

      const isValidateUser = response.data.isValidate;

      if (isValidateUser) {
        redirectToHomePage();
      } else {
        router.push({ name: 'validateUser' });
      }
    })
    .catch((error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const redirectToRegister = () => {
  router.push('/register');
};

const redirectToHomePage = () => {
  router.push('/homepage');
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
