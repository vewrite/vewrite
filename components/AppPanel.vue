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
  background-color: rgba($white-dark, .5);
  border: 1px solid rgba($purple, 0.1);
  margin: $spacing-md;
  border-radius: $br-xl;
  overflow: hidden;

  .header {
    background-color: rgba($white-dark, 1);
    border-bottom: 1px solid rgba($purple, 0.1);
    color: $black;
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
      gap: $spacing-xs;
    }
  }

  .body {
    height: calc(100% - 75px);
    overflow-y: hidden;
    position: relative;
  }
}


</style>