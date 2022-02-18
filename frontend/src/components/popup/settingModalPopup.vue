<template>
  <div class="modal">
    <div class="overlay" @click="$emit('close-modal')"></div>
    <div class="modal-card">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.modal,
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}

.overlay {
  opacity: 0.5;
  background-color: #000000;
}

.modal-card {
  opacity: 1;
  z-index: 30;
  padding: 20px;
  max-width: 80%;
  min-height: 500px;
  position: relative;
  margin: 30px auto auto;
  background-color: #ffffff;
}
</style>
