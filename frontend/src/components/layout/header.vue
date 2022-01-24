<template>
  <header id="header" class="header">
    <div class="row">
      <nav class="gnb">
        <router-link to="/monitoring">악취</router-link>
        <router-link to="/static">통계</router-link>
        <router-link to="/user/logout">로그아웃</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'main-header'
  }
</script>

<style scoped>

</style>
