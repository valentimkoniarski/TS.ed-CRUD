<template>
  <q-btn
    icon="delete"
    size="sm"
    color="negative"
    @click="deleteDialog = true"
    class="q-ml-sm"
  />

  <q-dialog
    v-model="deleteDialog"
    persistent
    title="Delete product"
    class="max-w-sm"
  >
    <q-card>
      <q-card-section class="text-h6">
        Are you sure you want to delete this product?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          v-close-popup
          @click="delProduct"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { deleteProduct } from 'src/services/product/product.service';
import { Notify } from 'quasar';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const emit = defineEmits(['deletedProduct']);

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const loading = ref(false);
const deleteDialog = ref(false);

const delProduct = () => {
  deleteDialog.value = true;
  loading.value = true;

  deleteProduct(props.productId)
    .then(() => {
      Notify.create({
        message: 'Product deleted successfully',
        color: 'positive',
        icon: 'check',
        position: 'bottom',
      });
    })
    .catch((error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      deleteDialog.value = false;
      loading.value = false;
      emit('deletedProduct', props.productId);
    });
};
</script>

<style scoped></style>
