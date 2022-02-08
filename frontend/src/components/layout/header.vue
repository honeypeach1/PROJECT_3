<template>
  <header id="header" class="header">
    <div class="row">
      <div class="header_Logo_area">
        <!--헤더 이미지 로고 영역-->
      </div>
      <div class="header_list_area">
        <ul class="menu_ul">
          <li>
            <div v-on:click="monitoring">악취</div>
          </li>
          <li>
            <div v-on:click="static">모니터링</div>
          </li>
          <li>
            <div v-on:click="userLogout">로그아웃</div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";

export default {
  name: 'main-header',
  methods: {
    monitoring: () => {
      this.$router.push('/monitoring')
    },
    static: () => {
      this.$router.push('/static')
    },
    userLogout: () => {
      /*axios.get('/user/logout')
        .then(() => {
          this.$router.push("/");
      })*/
      axios({
        url: "/user/logout",
        method: "GET",
      }).then((res) => {
        alert(res.data.message);
        this.$router.push("/");
      })
    }
  }
}
</script>

<style scoped>

</style>
