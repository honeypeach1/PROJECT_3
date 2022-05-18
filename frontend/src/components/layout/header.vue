<template>
  <header id="header_area" class="header_area">
    <div class="row">
      <div class="header_Logo_area">
        <!--헤더 이미지 로고 영역-->
        <div id="header_page_reload">
          <img id="header_img" src="../../assets/images/login/acen_logo.png" v-on:click="monitoring">
        </div>
      </div>
      <div class="header_list_area">
        <ul class="menu_ul">
          <div class="divider"></div>
          <li>
            <div class="menu" v-bind:class="{active:this.currentTab===0}" v-on:click="monitoring">악취</div>
          </li>
          <div class="divider"></div>
          <li>
            <div class="menu" v-bind:class="{active:this.currentTab===1}" v-on:click="static">통계</div>
          </li>
          <div class="divider"></div>
        </ul>
      </div>
      <div class="header_right_area">
        <div class="box_button_area">
          <svg class="button_svg" id="alert_info" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" v-on:click="toggle_alert_event">
            <path
              d="M15 21c0 1.598-1.392 3-2.971 3s-3.029-1.402-3.029-3h6zm.137-17.055c-.644-.374-1.042-1.07-1.041-1.82v-.003c.001-1.172-.938-2.122-2.096-2.122s-2.097.95-2.097 2.122v.003c.001.751-.396 1.446-1.041 1.82-4.668 2.709-1.985 11.715-6.862 13.306v1.749h20v-1.749c-4.877-1.591-2.193-10.598-6.863-13.306zm-3.137-2.945c.552 0 1 .449 1 1 0 .552-.448 1-1 1s-1-.448-1-1c0-.551.448-1 1-1zm-6.451 16c1.189-1.667 1.605-3.891 1.964-5.815.447-2.39.869-4.648 2.354-5.509 1.38-.801 2.956-.76 4.267 0 1.485.861 1.907 3.119 2.354 5.509.359 1.924.775 4.148 1.964 5.815h-12.903z"/>
          </svg>
          <svg class="alert_dot" id="alert_dot" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
               viewBox="0 0 24 24" v-on:click="toggle_alert_event">
            <path
              d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
          </svg>
        </div>
        <div class="box_button_area">
          <svg class="button_svg" id="setting_info" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" v-on:click="toggle_event">
            <path
              d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/>
          </svg>
        </div>
        <!--사용자 정보 영역-->
        <div class="header_user_control_area" v-if="info_show">
          <div class="common_user_div" id="user_name_area">
            <img class="user_info" src="../../assets/images/svg/User.svg"/>
            <p>{{user_info}}님</p>
          </div>

          <userModalView v-if="isUserView " @user-close="isUserView=false">
            <Content />
          </userModalView>
          <div class="admin_user_div click" @click="isUserView=true;" id="user_authority_area">
            <img class="user_setting" src="../../assets/images/svg/User_Control.svg"/>
            <p>회원관리</p>
          </div>

          <settingModalView v-if="isSettingView" @setting-close="isSettingView=false">
            <Content />
          </settingModalView>
          <div class="admin_user_div click" @click="isSettingView=true" id="equipment_setting_area">
            <img class="admin_setting" src="../../assets/images/svg/setting.svg"/>
            <p>장비관리</p>
          </div>

          <registerEquipModalView v-if="isEquipView" @equip-close="isEquipView=false">
            <Content />
          </registerEquipModalView>
          <div class="admin_user_div click" @click="isEquipView=true" id="register_equipment_area">
            <img class="equip_setting" src="../../assets/images/svg/Register_Equipment.svg"/>
            <p>장비등록</p>
          </div>

          <mapModalView v-if="isMapView" @map-close="isMapView=false">
            <Content />
          </mapModalView>
          <div class="admin_user_div click" @click="isMapView=true" id="map_setting_area">
            <img class="map_setting" src="../../assets/images/svg/Map_Setting.svg"/>
            <p>맵 설 정</p>
          </div>

          <div v-on:click="userLogout" id="logout_area">
            <img class="map_setting" src="../../assets/images/svg/LogOut.svg"/>
            <p>로그아웃</p>
          </div>
        </div>
        <!--모바일 선택 영역-->
<!--        <div class="choice_modal" v-if="choice_show">
          <div class="common_user_div">
            <img class="user_info" src="../../assets/images/svg/User.svg"/>
          </div>
          <p>{{this.user_name}}님</p>
          <div class="choice_modal_select">
            <p v-bind:class="{active:this.currentTab===0}" v-on:click="monitoring">악취</p>
            <p v-bind:class="{active:this.currentTab===1}" v-on:click="static">통계</p>
            <img class="map_setting" src="../../assets/images/svg/LogOut.svg"/>
            <p>로그아웃</p>
          </div>
        </div>-->

        <!--알람 정보 영역-->
        <div class="header_alert_area" v-if="alert_show">
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">1.애경</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">100.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">2.정밀화학</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">11.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">3.동일파크맨션</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">3.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">4.디지털엠파이어</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">115.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">5.최대여덟글자까지..</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">30.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
          <div class="alert_list">
            <!--장비명 영역-->
            <div class="alertEquipName">6.주짓수법인단체</div>
            <div class="alertDelete">삭제</div>
            <!--데이터 영역-->
            <div class="alertValueArea">
              <div class="alertValueHead">복합악취</div>
              <div class="alertValue">30.5</div>
            </div>
            <!--알람 시각 영역-->
            <div class="alertTimeArea">
              <div class="alertTimeHead">발생시각</div>
              <div class="alertTime">2022-05-02 23:59:59</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- fontawesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
  </header>
</template>
<script>
import axios from "axios";
import router from '../../router'
import mapModalView from '../../components/popup/mapModalPopup'
import settingModalView from '../../components/popup/settingModalPopup'
import userModalView from '../../components/popup/userModalPopup'
import registerEquipModalView from '../../components/popup/registerEquipPopup'
import $ from "jquery";

$(document).ready(function () {
  $('#alert_info').click(function () {
    alert($('.alertValue').text());
    console.log($('.alertValue').text());
    // 경고#db0f26
    // 주의#f89b00
  });
})

export default {
  name: 'main-header',
  props: [
    "currentTab"
  ],
  components: {
    mapModalView,
    settingModalView,
    userModalView,
    registerEquipModalView
  },
  mounted() {
    if(this.$store.state.user.token == null) {
      alert("비정상적인 접근입니다. 로그인을 해주세요.");
      return this.$router.push("/");
    }

    const loggedIn = localStorage.getItem('vuex');
    // console.log("헤더 vuex 확인 : ",loggedIn)
  },
  data: function () {
    return {
      info_show: false,
      alert_show: false,
      isMapView: false,
      isSettingView: false,
      isUserView: false,
      isEquipView: false,
      user_info: this.$store.state.user.user_info,
      mobile: false
    }
  },
  methods: {
    toggle_event: function () {
      this.info_show = !this.info_show
    },
    toggle_alert_event: function () {
      this.alert_show = !this.alert_show
    },
    monitoring() {
      axios({
        url: "/monitoring/getMonitorData",
        method: "GET",
      }).then((res) => {
        if (res.data.success == true) {
          /*
            데이터 호출이 성공했다면 아래에 라인 차트 & 데이터테이블 & 풍배도 & 풍향 빈도 구현
          */
          //this.user_info = res.data.user_info;
          //동일 페이지 접근시 catch 처리
          this.$router.push("/monitoring").catch(() => {
            router.go();
          });
        } else {
          alert("계정이 만료 되었습니다. 다시 로그인 해주세요.")
          this.$router.push("/");
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    static() {
      axios({
        url: "/static/goPage",
        method: "GET",
      }).then((res) => {
        if (res.data.success == true) {
          /*
            데이터 호출이 성공했다면 아래에 라인 차트 & 데이터테이블 & 풍배도 & 풍향 빈도 구현
          */
          //this.user_info = res.data.user_info;
          //동일 페이지 접근시 catch 처리
          this.$router.push("/static").catch(() => {
            router.go();
          });
        } else {
          alert("계정이 만료 되었습니다. 다시 로그인 해주세요.")
          this.$router.push("/");
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    userLogout() {
      this.$store.dispatch("LOGOUT")
      .then(() => {
          this.$router.push("/");
      })
     /* axios({
        url: "/user/logout",
        method: "POST",
      }).then((res) => {
        alert(res.data.message);
        router.push("/");
      })*/
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/common/font";
@import '../../assets/style/layout/header';
</style>
