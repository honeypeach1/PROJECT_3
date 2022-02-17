<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header v-bind:currentTab="currentTab"/>
    </div>
    <div id="staticPage">
      <!--장비 맵 영역-->
      <div class="staticLeftArea" id="staticMapArea">
        <div id="staticequipSelect">
          <select class="inlineMapSelectList">
            <option value="0" selected disabled>장비를 선택해주세요.</option>
            <optgroup v-for="(group, name) in options" :label="name">
              <option v-for="option in group" :value="option.value">
                {{ option.text }}
              </option>
            </optgroup>
          </select>
        </div>
        <div id="staticMap"></div>
      </div>

      <!--장비 데이터 조회 영역-->
      <div id="staticCenterArea">
        <div id="selectDateArea">
          <div class="dateArea">
            <label class="dataLabel">시작일/종료일</label>
            <label>
              <datetime class="startDateTime" type="date" v-model="date" id="beginDate" @change=""></datetime>
              <img class="calendarLogo" src="../../assets/images/layout/calendar_logo.png"/>
            </label>
            <span class="dot">~</span>
            <label>
              <datetime class="endDateTime" type="date" v-model="date" id="endDate" @change=""></datetime>
              <img class="calendarLogo" src="../../assets/images/layout/calendar_logo.png"/>
            </label>
            <label class="periodType">데이터구분</label>
            <label class="selectPeriodArea">
              <select class="selectPeriodData">
                <option value="0">1분</option>
                <option value="1">5분</option>
                <option value="2">10분</option>
                <option value="3">1시간</option>
                <option value="4">1일</option>
              </select>
            </label>
            <button class="alarmButton">알람조회</button>
          </div>
        </div>

        <!--데이터 테이블 영역-->
        <div id="showGraphArea">
          <div class="ContentsBodyGraph">
            <table id="datatable" class="commonTable" style="width:100%;">
              <thead>
              <tr>
                <th class="timeClass title" rowspan="3" style="width: 150px">시간</th>
                <th class="badClass title" colspan="6">대기환경</th>
                <th class="badClass title" colspan="5">기상정보</th>
              </tr>
              <tr>
                <th class="badClass title" colspan="2">복합악취</th>
                <th class="badClass subTitle" rowspan="2">H<sub>2</sub>S<br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">NH<sub>3</sub><br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">VOC<br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">MOS<br/>(OU)</th>
                <th class="weatherClass subTitle" rowspan="2" style="width: 75px">풍향<br/></th>
                <th class="weatherClass subTitle" rowspan="2">풍속<br/>(m/s)</th>
                <th class="weatherClass subTitle" rowspan="2">온도<br/>(℃)</th>
                <th class="weatherClass subTitle" rowspan="2">습도<br/>(%)</th>
                <th class="weatherClass subTitle" rowspan="2">대기압<br/>(mb)</th>
              </tr>
              <tr>
                <th class="badClass subTitle">배수</th>
                <th class="badClass subTitle">상태</th>
              </tr>
              </thead>
              <tbody id="selectDatatable">
              </tbody>
            </table>
          </div>
        </div>

        <!--데이터 차트 영역-->
        <div id="showChartArea">
          <canvas id="chartBar">

          </canvas>
        </div>
      </div>
      <!--풍배도 및 빈도 표현 영역-->
      <div id="staticRightArea">
        <div id="dataControlArea">
          <div id="dataDown">
            <img class="excelLogo" src="../../assets/images/layout/excelDown.png"/>
            <img class="emptyLogo" src="../../assets/images/layout/Down_box.png"/>
            <img class="emptyLogo" src="../../assets/images/layout/Down_box.png"/>
          </div>
        </div>
        <div id="showWindRoseArea">
          <div id="windRose">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "../layout/header";
import axios from "axios";
import ChartJs from 'vue-chartjs';
import DateTime from 'vue-datetime';
import Vue from 'vue';

import 'vue-datetime/dist/vue-datetime.css';

Vue.use(DateTime);
/*API 키*/
import dotenv from 'dotenv';
dotenv.config();
let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
/**/

export default {
  /*  props: ['chartData', 'options'],*/
  components: {
    'main-header': MainHeader,
    //datetime: DateTime,
    chartJs: ChartJs
  },
  data: function () {
    return {
      map: null,
      currentTab: 1,
      options: {
        'AMS-1000': [
          {text: 'BBQ치킨', value: 1},
          {text: '지코바', value: 2}
        ],
        'AMS-2000': [
          {text: '피자나라치킨공주', value: 3},
          {text: '신당동장독대를뛰쳐나온', value: 4}
        ]
      },
    };
  },
  mounted() {
    this.$emit('currentTab', 1)
    if (window.kakao && window.kakao.maps) {
      this.initStaticMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initStaticMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);
    }

    this.initChart();
  },
  methods: {
    initStaticMap() {
      const container = document.getElementById("staticMap");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);
    },
    initChart() {
      const ctx = document.getElementById("chartBar").getContext("2d");
      new Chart(ctx, this.chartJs)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/main/static";
</style>
