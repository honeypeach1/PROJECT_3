<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header v-bind:currentTab="currentTab"/>
    </div>
    <div id="staticPage">
      <!--장비 맵 영역-->
      <div class="staticLeftArea showMap" id="staticMapArea">
        <div id="staticMap"></div>
      </div>
      <!--장비 셀렉트 영역-->
      <div class="staticLeftArea showList" id="staticListArea">
      </div>

      <!--장비 데이터 조회 영역-->
      <div id="staticCenterArea">
        <div id="selectDateArea">기간 설정 영역</div>
        <div id="showGraphArea">그래프 영역</div>
        <div id="showChartArea">그래프 영역</div>
      </div>
      <!--풍배도 및 빈도 표현 영역-->
      <div id="staticRightArea">
        <div id="dataControlArea">데이터 조회</div>
        <div id="showWindRoseArea">풍배도 영역</div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "../layout/header";
import axios from "axios";

/*API 키*/
import dotenv from 'dotenv';

dotenv.config();
let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
/**/

export default {
  components: {
    'main-header': MainHeader,
  },
  data: function () {
    return {
      map: null,
      currentTab: 1,
    };
  },
  mounted() {
    this.$emit('currentTab',1)
    if (window.kakao && window.kakao.maps) {
      this.initStaticMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initStaticMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);
    }
  },
  methods: {
    initStaticMap() {
      const container = document.getElementById("staticMap");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/main/static";
</style>
