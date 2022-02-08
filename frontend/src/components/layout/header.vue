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
            <div v-on:click="static">통계</div>
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
import router from '../../router'

export default {
  name: 'main-header',
  methods: {
    monitoring: () => {
      router.push('/monitoring').catch(() => {
        //동일 페이지 접근시 새로고침 처리
        router.go();
      });
    },
    static: () => {
      router.push('/static').catch(() => {
        //동일 페이지 접근시 새로고침 처리
        router.go();
      })
    },
    userLogout: () => {
      axios({
        url: "/user/logout",
        method: "POST",
      }).then((res) => {
        alert(res.data.message);
        router.push("/");
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/layout/header';
</style>
