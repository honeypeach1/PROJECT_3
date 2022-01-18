<template>
  <div id="login">
    <!--로그인 이미지 영역-->
    <p class="loginBodyLogo">
      <img src="../../assets/images/login/login_logo.png" alt="ACEN"/>
    </p>
    <!--로그인 폼 영역-->
    <div class="form_area">
      <form id="login_form">
        <div class="inputDiv">
          <input id="user_id" class="login_input" type="text" placeholder="아이디" required aria-required="true">
        </div>
        <div class="inputDiv">
          <input id="user_pwd" class="login_input" type="password" placeholder="비밀번호" required aria-required="true">
        </div>
        <div class="inputDiv">
          <button class="btn_small" id="login_btn" type="submit" v-on:click="loginForm">로그인</button>
          <button class="btn_small" type="button" v-on:click="register">회원가입</button>
        </div>
      </form>
    </div>
    <!--로그인 하단 로고 이미지 영역-->
    <div class="loginLogo">
      <img src="../../assets/images/login/acen_logo.png" alt="ACEN"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user_id: "",
      isLogin: true,
      isRegister: true,
      register_id: "",
      register_pwd: "",
      register_role: 1
    };
  },
  methods: {
    loginSubmit: function () {
      console.log("로그인 처리");
      this.$router.push("/");
    },
    loginForm: function () {
      this.isLogin = true;
      this.isRegister = false;
      this.$router.push("/monitoring");
    },
    register: function () {
      this.isLogin = false;
      this.isRegister = true;
      this.$router.push("/signup");
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/style/member/login';
</style>
