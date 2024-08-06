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

@import 'assets/_variables.scss';

#AppPanel {
  display: flex;
  flex-direction: column;
  width: 100%;

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
      gap: $spacing-md;
    }
  }

  .body {
    height: calc(100% - 75px);
    overflow-y: auto;
  }
}


</style>