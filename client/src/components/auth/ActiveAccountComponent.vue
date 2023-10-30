<template>
  <div class="q-pa-md">
    <q-card class="q-card--bordered q-ma-md ">
      <q-card-section class="q-dialog-card-section-custom">
        <h4>Verify your email adress</h4>
        <p>
          A verification code has been sent to your email address. Please enter
          the code below to verify your email
        </p>

        <q-btn
          color="info"
          label="send code"
          @click="sendCodeEmail()"
          :disable="loading"
          class="q-ma-md"
          rounded
          size="md"
          glossy
        >
          <q-icon name="email" left />
        </q-btn>

        <div class="row justify-center">
          <div class="col col-xs-12 col-md-12">
            <q-input outlined v-model="codeVerify" @input="sendVerifyCode()">
              <template v-slot:append>
                <q-btn
                  color="primary"
                  icon="send"
                  @click="sendVerifyCode()"
                  label="verify"
                  flat
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-dialog v-model="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-dialog>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { activeAccount, verifyEmail } from 'src/services/auth/auth.service';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

const showDialog = ref(false);
const loading = ref(false);
const codeVerify = ref('');
const router = useRouter();

const sendCodeEmail = () => {
  loading.value = true;
  verifyEmail()
    .then(() => {
      Notify.create({
        message: 'Code sent successfully',
        color: 'positive',
        position: 'top-right',
        icon: 'check',
      });
    })
    .catch((error) => {
      Notify.create({
        message: 'Error sending code',
        color: 'negative',
        position: 'top-right',
        icon: 'close',
        timeout: 2000,
        caption: error.message,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const sendVerifyCode = () => {
  loading.value = true;
  activeAccount(codeVerify.value)
    .then(() => {
      Notify.create({
        message: 'Email verified successfully',
        color: 'positive',
        position: 'top-right',
        icon: 'check',
      });
      router.push('/homepage');
    })
    .catch((error) => {
      Notify.create({
        message: 'Error verifying email',
        color: 'negative',
        position: 'top-right',
        icon: 'close',
        timeout: 2000,
        caption: error.message,
      });
    })
    .finally(() => {
      loading.value = false;
      showDialog.value = false;
    });
};
</script>

<style scoped></style>
