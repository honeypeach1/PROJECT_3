<template>
  <div id="login">
    <!--로그인 이미지 영역-->
    <p class="loginBodyLogo">
      <img src="../../assets/images/login/login_logo.png" alt="ACEN"/>
    </p>
    <!--로그인 폼 영역-->
    <div class="form_area">
      <form id="login_form" @submit.prevent="login">
        <!--<input id="csrf_token" v-model="csrf_token" type="hidden" name="_csrf" value="{{csrf_token()}}"/>-->
        <div class="inputDiv">
          <input id="login_id" v-model="login_id" ref="login_id" class="login_input" type="text" placeholder="아이디"
                 required oninvalid="this.setCustomValidity('아이디를 입력해주세요.')" oninput="this.setCustomValidity('')"
                 aria-required="true">
        </div>
        <div class="inputDiv">
          <input id="login_pass" v-model="login_pass" ref="login_pass" class="login_input" type="password"
                 placeholder="비밀번호" required oninvalid="this.setCustomValidity('비밀번호를 입력해주세요.')"
                 oninput="this.setCustomValidity('')" autocomplete="on"
                 aria-required="true">
        </div>
        <div class="inputDiv">
          <button class="btn_small" id="login_btn" type="submit">로그인</button>
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
import router from "../../router";

export default {
  data() {
    return {
      login_id: "",
      login_pass: "",
      csrf_token: "",
      error: false,
    };
  },
/*  mounted() {
    let isLogIn = this.$store.state.user.isLogin;
    //만약 로그인 발행 토큰이 있다면(로그인 이력이 있음.) 이전 페이지로 돌아가게
    if (isLogIn) {
      alert("잘못된 접근입니다. 악취 페이지로 이동합니다.")
      this.$router.push({name: "MonitoringPage"});
    }
  },*/
  methods: {
    //dispatch 호출 방식 또는 store에 매핑된 getUser의 mutation 호출 방식
    login() {
      this.$store.dispatch("LOGIN", {
        login_id: this.login_id,
        login_pass: this.login_pass
      })
        .then(success => {
          if (this.$store.state.user.token != null) {
            //로그인 로그 처리 추가


            this.$router.push({name: "MonitoringPage"});
          }
        })
        .catch(error => {
          this.error = true;
        })
    },
    register: function () {
      this.$router.push("/signup");
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/style/member/login';
</style>
