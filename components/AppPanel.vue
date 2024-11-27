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
  overflow: hidden;
  background: rgba($brand, 0.02);
  margin: 0 $spacing-sm $spacing-sm $spacing-sm;
  border-radius: $br-md;
  border: $border;

  .header {
    color: $brand;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    width: 100%;
    padding: 0 $spacing-sm;
    position: relative;
    background: rgba($brand, 0.035);

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
    height: calc(100% - 44px);
    overflow-y: hidden;
    position: relative;
  }
}


</style>