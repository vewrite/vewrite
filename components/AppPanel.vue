<template>
  <main id="AppPanel">
    <div class="panel-title">
      <!-- <h1>{{ route }}</h1> -->
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </main>
</template>

<script setup>

import { ref } from 'vue'
import { useRoute } from 'vue-router'

// const route = useRoute().path

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#AppPanel {
  display: flex;
  flex-direction: column;
  width: 100%;

  .panel-title {
    background-color: $purple;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 75px;
    width: 100%;

    h1 {
      margin:0;
      text-align: center;
      width: 100%;
      font-size: $font-size-md;
    }
  }

  .panel-content {
    flex: 1;
    padding: 20px;
  }
}


</style>