<template>
  <div id="AppPanel" class="app-panel">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPanel'
}
</script>

<style lang="scss">

@use 'assets/variables' as *;

#AppPanel {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgba($white, 1);
  overflow: hidden;

  .header {
    border-left: $border;
    color: $brand;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 54px;
    width: 100%;
    padding: 0 $spacing-sm;
    position: relative;

    .app-panel-header {
      margin:0;
      text-align: center;
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 400;
      position: absolute;
      left:0;
      right:0;
      pointer-events: none;
    }

    .app-panel-header-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: $spacing-xs;
    }
  }

  .body {
    height: calc(100% - 54px);
    overflow-y: hidden;
    position: relative;
    background: rgba($gray-light, 0.15);
    border-left: $border;
    border-top: $border;
  }
}


</style>