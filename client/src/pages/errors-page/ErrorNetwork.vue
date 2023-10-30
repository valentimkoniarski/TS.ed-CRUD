<template>
  <div
    class="fullscreen bg-green-5 text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 10vh">ERROR NETWORK</div>

      <div class="text-h2" style="opacity: 0.4">
        Check that your connection to the server is established.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound',
});
</script>
