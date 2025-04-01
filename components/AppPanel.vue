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
  margin: $spacing-sm auto 0;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-xs;
    position: relative;
    margin: 0;
    padding: $spacing-sm;
    background: $white;
    border-bottom: $border;

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
    position: relative;
    background: $white;

    @media (max-width: 960px) {
      border: none;
      margin: 0;
      border-radius: 0;
    }
  }
}


</style>