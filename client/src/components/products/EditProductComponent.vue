<template>
  <q-page>
    <q-card class="q-card--bordered q-ma-md ">
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
                  size="sm"
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
                  size="sm"
                  v-model="product.price"
                  :rules="[productPriceRule]"
                  filled
                  standout
                  label="Price"
                  type="number"
                  :formatter="(val) => (val ? parseFloat(val).toFixed(2) : '')"
                  dense
                ></q-input>
              </div>
            </div>
            <div class="row justify-center">
              <div class="col col-xs-12 col-md-12">
                <q-input
                  size="sm"
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
                :disable="!isFormValid()"
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
import { onMounted, ref, computed } from 'vue';
import {
  updateProduct,
  findProductById,
} from 'src/services/product/product.service';
import { useRouter } from 'vue-router';
import { Product } from 'src/models/Product';
import { Notify, useQuasar } from 'quasar';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const $q = useQuasar();

const product = ref<Product>({
  name: '',
  price: 0,
  description: '',
});
const loading = ref(false);
const router = useRouter();
const productId = router.currentRoute.value.params.id;

const isDesktop = computed(() => {
  return !$q.screen.lt.md;
});

const productNameRule = (val: string) => {
  const nameRegex = /^[a-zA-Z0-9 ]{2,20}$/;
  if (!nameRegex.test(val)) {
    if (isDesktop.value) {
      return 'Name must be between 2 and 20 characters long and contain only letters and numbers';
    }
    return 'Name invalid';
  }
};

const productPriceRule = (val: string) => {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(val)) {
    if (isDesktop.value) {
      return 'Price must be a number with two decimal places';
    }
    return 'Price invalid';
  }
};

const productDescriptionRule = (val: string) => {
  if (val.length < 6 || val.length > 40) {
    if (isDesktop.value) {
      return 'Description must be between 6 and 40 characters long';
    }
    return 'Description invalid';
  }
};

const isFormValid = () => {
  return (
    productNameRule(product.value.name) === undefined &&
    productPriceRule(product.value.price.toString()) === undefined &&
    productDescriptionRule(product.value.description) === undefined
  );
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
    });
};

onMounted(() => {
  loading.value = true;

  findProductById(productId)
    .then((response) => {
      product.value = response.data;
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
