<template>

  <div id="header">
    <main-header/>
  </div>

  <div id="staticPage">
    <h1>장비 통계 페이지</h1>
  </div>

  <div id="footer">
    <main-footer/>
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

<style>

</style>
