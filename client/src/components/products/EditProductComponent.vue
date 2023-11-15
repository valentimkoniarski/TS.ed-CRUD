<template>
  <q-page>
    <q-card class="q-card--bordered q-ma-md">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Homepage" icon="widgets" to="/homepage" />
          <q-breadcrumbs-el label="Edit Product" />
        </q-breadcrumbs>
      </div>

      <q-card-section>
        <div class="q-gutter-md">
          <h2 class="text-h6 q-mb-md">Edit Product</h2>
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
                  type="number"
                  :formatter="(val: string) => (val ? parseFloat(val).toFixed(2) : '')"
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
                @click="editProduct()"
                :disable="isFormInvalid"
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
import { onMounted, ref } from 'vue';
import {
  updateProduct,
  findProductById,
} from 'src/services/product/product.service';
import { useRouter } from 'vue-router';
import { Product } from 'src/models/Product';
import { Notify } from 'quasar';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';
import { useProductValidation } from './useProductValidation';

const product = ref<Product>({
  name: '',
  price: 0,
  description: ''
});

const loading = ref(false);
const router = useRouter();
const productId = router.currentRoute.value.params.id;

const { productNameRule, productPriceRule, productDescriptionRule, isFormInvalid } = useProductValidation(product.value);

const redirectToHomePage = () => {
  router.push('/homepage');
};

const editProduct = () => {
  loading.value = true;
  updateProduct(productId, product.value)
    .then(() => {
      Notify.create({
        message: 'Product updated successfully',
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
      redirectToHomePage();
    });
};

onMounted(() => {
  loading.value = true;

  findProductById(productId)
    .then((response) => {
      product.value.name = response.data.name;
      product.value.price = response.data.price;
      product.value.description = response.data.description;
    })
    .catch((error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<style scoped>
.col {
  padding: 5px;
}
</style>
