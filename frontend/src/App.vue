<template>
  <div id="app" style="height: 100%">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    let token = this.$store.getters.getToken;
    if(token.access == null && token.refresh == null){
      this.$router.push("/");

    }
  }
}
</script>

<style type="text/css">
  #app {
    height: 100%;
  }
</style>
