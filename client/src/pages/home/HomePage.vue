<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row btn-add">
        <q-btn @click="createProductView()" color="primary" label="Add product">
          <q-icon name="add" left />
        </q-btn>
      </div>

      <div v-if="!hasProducts()" class="row justify-center">
        <div class="col col-xs-12 col-md-12">
          <q-card>
            <q-card-section>
              <div class="row justify-center">
                <div class="col col-xs-12 col-md-12">
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-h6">
                        No products found
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <template v-if="isDesktop && hasProducts()">
        <q-table
          :rows="products"
          :columns="columns"
          row-key="id"
          :hidePagination="true"
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

      <template v-else-if="hasProducts()">
        <q-card v-for="row in products" :key="row.id" class="q-mb-md">
          <q-card-section>
            <q-item v-for="column in columns" :key="column.name">
              <q-item-section>
                <q-item-label v-show="column.label !== 'Action'">{{
                  column.label
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ row[column.name] }}
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn icon="edit" size="sm" @click="updateProductView(row?.id)" />
            <DeleteProductComponent
              :product-id="row?.id"
              @deletedProduct="refresh()"
            />
          </q-card-actions>
        </q-card>
      </template>
    </div>

    <q-pagination color="white text-dark" text-color="dark" v-model="nextPage" :max="maxPages()" />

    <q-dialog v-model="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format, useQuasar } from 'quasar';
import { findAllProducts } from 'src/services/product/product.service';
import { Product } from 'src/models/Product';
import { useRouter } from 'vue-router';
import DeleteProductComponent from 'components/products/DeleteProductComponent.vue';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

const router = useRouter();

const $q = useQuasar();
const loading = ref(false);
const products = ref<Product[]>([]);

const hasProducts = () => {
  return products.value.length > 0;
};

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});

const nextPage = ref(0)

watch(nextPage, (newPagination) => {
  if (newPagination !== pagination.value.page) {
    pagination.value.page = newPagination;
    refresh();
  }
});

const maxPages = () => {
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
}

const refresh = () => {
  loading.value = true;

  findAllProducts(pagination.value.page, pagination.value.rowsPerPage)
    .then((response) => {
      products.value = response.data.results;
      pagination.value.rowsNumber = response.data.total;
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
