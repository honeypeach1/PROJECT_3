<template>
  <div id="login">
    <!--로그인 이미지 영역-->
    <p class="loginBodyLogo">
      <img src="../../assets/images/login/login_logo.png" alt="ACEN"/>
    </p>
    <!--로그인 폼 영역-->
    <div class="form_area">
      <form id="login_form">
        <input id="csrf_token" v-model="csrf_token" type="hidden" name="_csrf" value="{{csrf_token()}}" />
        <div class="inputDiv">
          <input id="login_id" v-model="login_id" class="login_input" type="text" placeholder="아이디" required aria-required="true">
        </div>
        <div class="inputDiv">
          <input id="login_pass" v-model="login_pass" class="login_input" type="password" placeholder="비밀번호" required aria-required="true">
        </div>
        <div class="inputDiv">
          <button class="btn_small" id="login_btn" v-on:click="login" type="submit">로그인</button>
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
import axios from "axios";

export default {
  data() {
    return {
      login_id: "",
      login_pass: "",
      csrf_token:""
    };
  },
  methods: {
    ckCookie: function () {
      /*쿠키 세션을 활용하여 도메인 monitoring 메인페이지로 이동 기능*/
      this.$router.push("/");
    },
    login: function () {
      axios({
        url:"/user/loginCheck",
        method: "POST",
        data: {
          login_id:this.login_id,
          login_pass: this.login_pass,
          csrf_token:this.csrf_token
        }
      }).then((res) => {
        if(res){
          console.log("res : ",res)
          this.$router.push("/monitoring");
          /*로그인 성공 처리*/
        }else{
          alert("계정 정보를 찾을 수 없습니다.");
        }
      }).catch((error) => {
        console.log(error)
      }).finally((error) => {
        console.log(error)
      })
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
