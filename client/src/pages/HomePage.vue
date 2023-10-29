<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row btn-add">
        <q-btn @click="createProductView" color="primary" label="Add product">
          <q-icon name="add" left />
        </q-btn>
      </div>

      <template v-if="isDesktop">
        <q-table
          :rows="products"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          @update:pagination="updatePagination"
        >
          <template v-slot:body-cell-action="props">
            <q-td
              :props="props"
              :class="props.colName === 'action' ? 'text-right' : ''"
            >
              <q-btn
                icon="edit"
                size="sm"
                @click="updateProductView(props.key)"
                class="q-ml-sm"
              />

              <DeleteProductComponent
                :product-id="props.key"
                @deletedProduct="refresh()"
              />
            </q-td>
          </template>
        </q-table>
      </template>

      <template v-else>
        <q-card v-for="row in products" :key="row.id" class="q-mb-md">
          <q-card-section>
            <q-item v-for="column in columns" :key="column.name">
              <q-item-section>
                <q-item-label>{{ column.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ row[column.name] }}
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn icon="edit" size="sm" @click="updateProductView(row?.id)" />
            <DeleteProductComponent
              :product-id="row?.id"
              @deletedProduct="refresh()"
            />
          </q-card-actions>
        </q-card>
<!--        <q-pagination v-model="paginationCard" :max="total" />-->
      </template>
    </div>

    <q-dialog v-model="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {format, useQuasar} from 'quasar';
import { findAllProducts } from 'src/services/product/product.service';
import { Product } from 'src/models/Product';
import { useRouter } from 'vue-router';
import DeleteProductComponent from 'components/products/DeleteProductComponent.vue';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const router = useRouter();

const $q = useQuasar();
const loading = ref(false);
const products = ref<Product[]>([]);

const pagination = ref({
  page: 1,
  rowsPerPage: 5
});

const updatePagination = (newPagination: any) => {
  pagination.value = newPagination;
};

watch(pagination, (newPagination) => {
  refresh();
});

const refresh = () => {
  loading.value = true;

  findAllProducts(pagination.value.page, pagination.value.rowsPerPage)
    .then((response) => {
      console.log(response);
      products.value = response.data.results;
    })
    .catch((error) => {
      errorRequestNotificationUtil(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  refresh();
});

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    align: 'left',
    sortable: true,
    format: (val: any) => {
      return parseFloat(val).toFixed(2);
    },
  },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    align: 'right',
  },
];

const updateProductView = (productId: any) => {
  router.push({ name: 'editProduct', params: { id: productId } });
};

const createProductView = () => {
  router.push({ name: 'createProduct' });
};

const isDesktop = computed(() => {
  return !$q.screen.lt.md;
});
</script>

<style scoped>
.btn-add {
  margin-bottom: 10px;
}
</style>
