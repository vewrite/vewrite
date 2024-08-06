<template>
  <main id="Modal">
    <div class="modal-body">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="body">
        <slot name="body"></slot>
      </div>
    </div>
  </main>
</template>

<script setup>

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: $spacing-lg;
  background-color: rgba($black, 0.25);
  backdrop-filter: blur(8px);
  z-index: 1000;

  .modal-body {
    background-color: white;
    border-radius: $br-md;
    overflow: auto;
    width: 100%;
    height: 100%;

    .header {
      background-color: $purple;
      color: white;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 75px;
      width: 100%;
      padding: 0 $spacing-md;
      position: relative;
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 400;

      .app-panel-header-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: $spacing-xs;
      }
    }
  }
}

</style>