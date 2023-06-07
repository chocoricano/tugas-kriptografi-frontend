<template>
  <div>
    <h1>
      {{store.test}}
    </h1>
  </div>
</template>

<script>
import { storage } from '../stores/store';
export default {
  setup(){
    const store = storage();
    return {
      store
    }
  }

}
</script>

<style>

</style>