<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header v-bind:currentTab="currentTab"/>
    </div>
    <div id="staticPage">
      <!--장비 맵 영역-->
      <div class="staticLeftArea" id="staticMapArea">
        <div id="staticequipSelect">
          <select class="inlineMapSelectList" v-model="equipNum" @change="getData">
            <option value="0" selected disabled>장비를 선택해주세요.</option>
            <optgroup v-for="(group, name) in selectOptions" :label="name">
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
          <div class="sort_front_area">
            <div class="dataLabel">기간 설정</div>
            <v-md-date-range-picker @change="datepicker"></v-md-date-range-picker>
            <div class="periodType">데이터구분</div>
            <div class="selectPeriodArea">
              <select class="selectPeriodData" v-model="dataType" @change="getData">
                <option value="0">1분</option>
                <option value="1">5분</option>
                <option value="2">10분</option>
                <option value="3">1시간</option>
                <option value="4">1일</option>
              </select>
            </div>
          </div>
          <div class="sort_back_area">
            <button class="alarmButton" :class="{toggled: isAlarm}" @click="goSelectData">
              {{ isAlarm ? '데이터조회' : '알람조회' }}
            </button>
          </div>
        </div>

        <!--데이터 테이블 영역-->
        <div id="showGraphArea">
          <div class="ContentsBodyGraph">
            <table class="commonTable" id="datatable" style="width:100%;">
              <thead>
              <tr>
                <th class="timeClass title" rowspan="3" style="min-width: 150px">시간</th>
                <th class="badClass title" colspan="6">대기환경</th>
                <th class="badClass title" colspan="4">기상정보</th>
                <th class="badClass title">전압</th>
              </tr>
              <tr>
                <th class="badClass title" colspan="2" style="min-width: 110px; max-width: 200px">복합악취</th>
                <th class="badClass subTitle" rowspan="2">H<sub>2</sub>S<br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">NH<sub>3</sub><br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">VOC<br/>(ppb)</th>
                <th class="badClass subTitle" rowspan="2">MOS<br/>(OU)</th>
                <th class="weatherClass subTitle" rowspan="2" style="min-width: 60px">풍향<br/></th>
                <th class="weatherClass subTitle" rowspan="2">풍속<br/>(m/s)</th>
                <th class="weatherClass subTitle" rowspan="2">온도<br/>(℃)</th>
                <th class="weatherClass subTitle" rowspan="2">습도<br/>(%)</th>
                <th class="weatherClass subTitle" rowspan="2">전압<br/>(V)</th>
              </tr>
              <tr>
                <th class="badClass subTitle" style="min-width: 60px; max-width: 100px">배수</th>
                <th class="badClass subTitle" style="min-width: 50px; max-width: 100px">상태</th>
              </tr>
              </thead>
            </table>
            <!--            <datatable :columns="datatable.data.columns" :data="datatable.data.rows"></datatable>-->
          </div>
        </div>

        <!--데이터 차트 영역-->
        <div class="showChartArea">
          <div id="chartStaticBar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "../layout/header";
import getLineChart from './chart_attribute/lineChart';
import axios from "axios";
import $ from 'jquery';

import Vue from 'vue';
import dotenv from 'dotenv';
import Datatable from "datatables.net"
import "jszip/dist/jszip.min"
import "jquery/dist/jquery.min"
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.css"
import "datatables.net-buttons/js/dataTables.buttons"
import "datatables.net-buttons/js/buttons.colVis"
import "datatables.net-buttons/js/buttons.flash"
import "datatables.net-buttons/js/buttons.print"
import "datatables.net-buttons/js/buttons.html5"

import VMdDateRangePicker from "v-md-date-range-picker";
import router from "../../router";
import imageSrc from "../../assets/images/svg/marker_image_1.svg";
import getPlotlyLang from "./chart_attribute/plotlyKoreanSetting";

Vue.use(VMdDateRangePicker);

/*API 키*/
dotenv.config();
let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
/**/
let datatableValue;
export default {
  components: {
    'main-header': MainHeader,
  },
  data: function () {
    return {
      staticMap: null,
      currentTab: 1,
      selectOptions: [],
      values: [],
      equipNum: 0,
      dataType: 0,
      isAlarm: false,
      staticMarkers: [],
      markerPositions: [],
      start_date: '',
      end_date: '',
      lineChart: getLineChart,
      responsive: true,
      tableData: null
    }
  },
  mounted() {
    this.$emit('currentTab', 1)
    if (window.kakao && window.kakao.maps) {
      this.initStaticMap();
    } else {
      const script = document.createElement("script");
      /* local kakao */
      script.onload = () => kakao.maps.load(this.initStaticMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);
    }
    ;
    //맵 좌표 정보 가져오기
    this.getStaticMapEquipmentList();
    //장비 리스트 가져오기
    this.getEquipmentList();
  },
  methods: {
    excelDown() {
      $(".buttons-excel").click();
    },
    printDown() {
      $(".buttons-print").click();
    },
    getEquipmentList() {
      axios({
        url: "/equipment/getThreshold",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.selectOptions = data.equipmentList;
        }
      })
    },
    getStaticMapEquipmentList() {
      axios({
        url: "/equipment/getEquipmentList",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.markerPositions = data.equipmentList;
          //지도 좌표 설정하기
          this.displayStaticMarker();
        }
      })
    },
    displayStaticMarker() {
      if (this.staticMarkers.length > 0) {
        this.staticMarkers.forEach((marker) => marker.setMap(null));
      }
      let imageSrc = require('../../assets/images/svg/marker_image_1.svg'),
        imageSize = new kakao.maps.Size(35, 45),
        imageOption = {offset: new kakao.maps.Point(15, 40)};
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      this.markerPositions.forEach((datas) => {
        this.staticMarkers = new kakao.maps.Marker({
          map: this.staticMap,
          title: datas.EQUIPMENT_NAME,
          position: new kakao.maps.LatLng(datas.EQUIPMENT_LAT, datas.EQUIPMENT_LNG),
          image: markerImage
        });

        let iwContent = '<div style="padding:5px;">' + datas.EQUIPMENT_NAME + '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        this.infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: true,// removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
        });
        this.infowindow.open(this.staticMap, this.staticMarkers);
      })
    },
    initStaticMap() {
      const container = document.getElementById("staticMap");
      const options = {
        center: new kakao.maps.LatLng(33.451616, 126.56672),
        level: 5,
      };
      this.staticMap = new kakao.maps.Map(container, options);
    },
    initDataTable() {
      if (datatableValue != undefined) {
        datatableValue.clear();
        datatableValue.destroy();
      }
      datatableValue = $('#datatable').DataTable({
        dom: 'Bfrtip',
        pageLength: 10,
        order: [[1, 'asc']],
        // autoWidth: false,
        // autoHeight: false,
        /*수정중*/
        language: {
          "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Korean.json"
        },
        buttons: [
          {
            extend: 'excelHtml5'
            , text: '엑셀출력'
            // ,filename: '엑셀파일명'
            // ,title: '엑셀파일 안에 쓰일 제목'
          },
          {
            extend: 'csv'
            , text: 'csv출력'
            // ,filename: 'utf-8이라서 ms엑셀로 바로 열면 글자 깨짐'
          },
          {
            extend: 'print'
            , text: '인쇄'
            // ,title: '클립보드 복사 내용'
          },
        ],
        // data: this.datatable.data.rows,
        data: this.tableData,
        columns: [
          {data: 'DataDateTime'},
          {data: 'TOD'},
          {data: 'todValue'},
          {data: 'H2S'},
          {data: 'NH3'},
          {data: 'VOC'},
          {data: 'MOS'},
          {data: 'OWD'},
          {data: 'OWS'},
          {data: 'OTT'},
          {data: 'OTH'},
          {data: 'BTV'}
        ]
      });
      $(".dt-buttons").hide();
    },
    lineStaticChart() {
      Plotly.newPlot("chartStaticBar", this.lineChart.chartDraw(this.tableData), this.lineChart.layout, this.options);
      getPlotlyLang.changePlotlyLang();
    },
    datepicker(values) {
      /*해당 로직에서는 무조건 2개 이하의 데이터 호출*/

      //* 수정 필요
      //1. 기간은 시작 데이터만 선택이 될수도 있고, 마지막 데이터만 선택이 될 수 있음. 배열은 시작과 끝을 구분할 수 없음.
      //2. 이후에 대한 기간 선택은 블락 처리를 해야함. 미래의 데이터는 없기 때문에 의미가 없음.
      for (let i in values) {
        if (i == 0) {
          this.start_date = values[i].year() + '-'
            + (values[i].month() + 1 < 10 ? ('0' + (values[i].month() + 1)) : (values[i].month() + 1))
            /*            + '-' + (values[i].date() < 10 ? ('0' + values[i].date()) : values[i].date()) + ' 00:00:00';*/
            + '-' + (values[i].date() < 10 ? ('0' + values[i].date()) : values[i].date());
        } else {
          this.end_date = values[i].year() + '-'
            + (values[i].month() + 1 < 10 ? ('0' + (values[i].month() + 1)) : (values[i].month() + 1))
            /*            + '-' + (values[i].date() < 10 ? ('0' + values[i].date()) : values[i].date()) + ' 59:59:59';*/
            + '-' + (values[i].date() < 10 ? ('0' + values[i].date()) : values[i].date());
        }
      }

      this.values = values;
      //axios 데이터 셀렉 호출
      this.getData();
    },
    goSelectData() {
      this.isAlarm = !this.isAlarm
      this.getData();
    },
    /*
      static 페이지에서 비동기식 데이터 호출 함수

       1. 해당 함수 필요 리턴 데이터
        1.1 기본 셀렉 리스트 또는 알람 리스트
        1.2 데이터 로우 - 라인 차트
        1.3 풍배도 표 빈도수
        1.4 풍배도 그래프 출력 데이터

       2. 필요 파라미터 - 별도의 영역 설정에 따른 호출로 아래 파라미터는 전역 변수로 가지고 있어야함.
        2.1 장비 넘버                                           @param -> equipNum
        2.2 기간 데이터                                          @param -> [start_date, end_date]
        2.3 데이터 구분                                          @param -> dataType
        2.4 알람 정보(클릭 여부에 따라 아니면 기본 데이터 로우 콜)      @param -> isAlarm
        만약 데이터가 없다면 별도의 예외 처리 진행

        3. 함수 콜 로직
         3.1 장비 리스트 클릭
         3.2 기간 설정 클릭
         3.3 데이터 구분 클릭
         3.4 알람 조회 클릭
         3.5 상단 헤더에서의 특정 알람을 클릭
    */
    getData() {
      axios({
        url: "/static/getData",
        method: "GET",
        params: {
          start_date: this.start_date,
          end_date: this.end_date,
          isAlarm: this.isAlarm,
          dataType: this.dataType,
          equipNum: this.equipNum
        }
      }).then((res) => {
        /*
          데이터 호출이 성공했다면 아래에 라인 차트 & 데이터테이블 & 풍배도 & 풍향 빈도 구현
        */
        this.tableData = res.data.tableData;
        //데이터 테이블 그리기
        this.initDataTable();
        //라인 차트 그리기
        this.lineStaticChart();
      }).catch((error) => {
        console.log('getData 호출 에러 : ', error)
      })
    }
  },
}

window.onresize = function () {
  Plotly.relayout('chartBar', {
    'xaxis.autorange': true,
    'yaxis.autorange': true,
  });
};

</script>

<style lang="scss">
@import "../../assets/style/main/static";
</style>
