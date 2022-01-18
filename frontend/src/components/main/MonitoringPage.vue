<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header/>
    </div>

    <div id="body-content">
      <h1>악취 메인 페이지</h1>
    </div>

    <div id="footer">
      <main-footer/>
    </div>
  </div>
</template>

<script>
import MainHeader from "../layout/header";
import MainFooter from "../layout/footer";

export default {
  components: {
    'main-header': MainHeader,
    'main-footer': MainFooter
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
