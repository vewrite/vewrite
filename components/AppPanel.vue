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

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
    padding: $spacing-sm;
    gap: $spacing-xs;
    position: relative;
    margin: 0 $spacing-sm;
    border-top: $border;
    border-bottom: $border;
    border-left: $border;
    border-right: $border;
    border-top-left-radius: $br-xl;
    border-top-right-radius: $br-xl;
    background: linear-gradient(to bottom, rgba($white, 0.25), rgba($white, 0.5) 50%);

    @media (max-width: 960px) {
      border: none;
      border-radius: 0;
      margin: 0;
    }

    .app-panel-header-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
    }

    .app-panel-header-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: $spacing-xs;

      .notification {
        white-space: nowrap;
      }

      .vertical-divider {
        height: 20px;
        width: 1px;
        background: rgba($black, 0.15);
      }
    }
  }

  .body {
    height: calc(100% - 60px);
    overflow-y: auto;
    position: relative;
    background: $white;
    margin: 0 $spacing-sm;
    border-bottom: $border;
    border-left: $border;
    border-right: $border;

    @media (max-width: 960px) {
      border: none;
      margin: 0;
      border-radius: 0;
    }
  }
}


</style>