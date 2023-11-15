<template>
  <q-page>
    <q-card class="q-card--bordered q-ma-md">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Homepage" icon="widgets" to="/homepage" />
          <q-breadcrumbs-el label="Create Product" />
        </q-breadcrumbs>
      </div>

      <q-card-section>
        <div class="q-gutter-md">
          <h2 class="text-h6 q-mb-md">Create Product</h2>
          <div class="q-pa-md example-row-variable-width">
            <div class="row justify-center">
              <div class="col col-xs-6 col-md-6">
                <q-input
                  v-model="product.name"
                  :rules="[productNameRule]"
                  filled
                  standout
                  label="Name"
                  dense
                ></q-input>
              </div>
              <div class="col col-xs-6 col-md-6">
                <q-input
                  v-model="product.price"
                  :rules="[productPriceRule]"
                  filled
                  standout
                  label="Price"
                  dense
                ></q-input>
              </div>
            </div>
            <div class="row justify-center">
              <div class="col col-xs-12 col-md-12">
                <q-input
                  v-model="product.description"
                  :rules="[productDescriptionRule]"
                  filled
                  standout
                  label="Description"
                  dense
                ></q-input>
              </div>
            </div>

            <div class="row justify-end">
              <q-btn
                color="primary"
                label="Save"
                @click="addProduct()"
                :disabled="isFormInvalid"
                class="q-ma-md custom-button"
                rounded
                size="lg"
                glossy
              >
                <q-icon name="save" left />
                <q-spinner-facebook v-if="loading" />
              </q-btn>
            </div>

            <q-dialog v-model="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-dialog>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createProduct } from 'src/services/product/product.service';
import { Product } from 'src/models/Product';
import { Notify } from 'quasar';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';
import { useRouter } from 'vue-router';
import { useProductValidation } from './useProductValidation';

const router = useRouter();

const product = ref<Product>({
  name: '',
  price: 0,
  description: '',
});

const loading = ref(false);

const {
  productNameRule,
  productPriceRule,
  productDescriptionRule,
  isFormInvalid
} = useProductValidation(product.value);

const redirectToHomePage = () => {
  router.push('/homepage');
};

const addProduct = () => {
  loading.value = true;
  createProduct(product.value)
    .then(() => {
      Notify.create({
        message: 'Product updated successfully',
        color: 'positive',
        icon: 'check',
        position: 'bottom',
      });
    })
    .catch((error: Error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      redirectToHomePage();
      loading.value = false;
    });
};
</script>

<style scoped>
.col {
  padding: 5px;
}
</style>
