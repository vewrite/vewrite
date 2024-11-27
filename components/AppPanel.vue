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
  background: rgba($brand, 0.05);

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 54px;
    padding: 0 $spacing-sm;
    position: relative;
    margin-right: $spacing-sm;
    border-top: $border;
    border-left: $border;
    border-right: $border;
    border-top-left-radius: $br-lg;
    border-top-right-radius: $br-lg;
    background: rgba($white, 0.35);

    @media (max-width: 960px) {
      border: none;
      border-radius: 0;
      border-bottom: $border;
      margin: 0;
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
    background: $white;
    margin-right: $spacing-sm;
    margin-bottom: $spacing-sm;
    border-bottom: $border;
    border-left: $border;
    border-right: $border;
    border-bottom-left-radius: $br-lg;
    border-bottom-right-radius: $br-lg;
    box-shadow: $main-shadow;

    @media (max-width: 960px) {
      border: none;
      margin: 0;
      border-radius: 0;
    }
  }
}


</style>