import { Product } from 'src/models/Product';
import { computed } from 'vue';
import { useQuasar } from 'quasar';

export function useProductValidation(product: Product) {
  const $q = useQuasar();

  const isDesktop = computed(() => {
    return !$q.screen.lt.md;
  });

  const productNameRule = (val: string) => {
    if (val.length < 2 || val.length > 20) {
      return isDesktop.value
        ? 'Product name must be between 2 and 20 characters long'
        : 'Invalid product name';
    }
    return true;
  };

  const productPriceRule = (val: string) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(val)) {
      return isDesktop.value
        ? 'Price must be a number with two decimal places'
        : 'Invalid price';
    }
    return true;
  };

  const productDescriptionRule = (val: string) => {
    if (val.length < 6 || val.length > 40) {
      return isDesktop.value
        ? 'Description must be between 6 and 40 characters long'
        : 'Invalid description';
    }
    return true;
  };

  const isFormInvalid = computed(() => {
    const rules = [
      productNameRule(product.name),
      productPriceRule(product.price.toString()),
      productDescriptionRule(product.description)
    ];

    return rules.some((rule) => rule !== true);
  });

  return {
    isFormInvalid,
    productNameRule,
    productPriceRule,
    productDescriptionRule
  };
}
