<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header v-bind:currentTab="currentTab"/>
    </div>

    <div id="body-content">
      <div id="leftArea">
        <div id="equipmentListArea">
          <div id="HeaderArea">
            <select id="equipSelect" v-model="equipNum" @change="mainGetData">
              <option value="0" disabled>장비를 선택해주세요.</option>
              <optgroup v-for="(group, name) in selectOptions" :label="name">
                <option v-for="option in group" :value="option.value">
                  {{ option.text }}
                </option>
              </optgroup>
            </select>
          </div>
          <div id="selectEquipment" class="selectEquipment">
            <div class="selectTitle">
              <span>채취상태</span>
              <a class="collectarea" @click="collectorControllView()">
                <div>
                  <span class="rightSpan">동작</span>
                  <img class="collectorBtn" v-if="!isCollectShow" src="../../assets/images/layout/btn_down.png" alt="temp"/>
                  <img class="collectorBtn" v-if="isCollectShow" src="../../assets/images/layout/btn_up.png" alt="temp"/>
                </div>
              </a>
            </div>
            <div class="selectBody">
              <div class="selectBodyContent">
                <div class = "totalbox box1">
                  <div class="box_title">구분</div>
                  <div class="box_value">채취장비</div>
                </div>
                <div class = "totalbox box2">
                  <div class="box_title">모드</div>
                  <div class="box_value">수동</div>
                </div>
                <div class = "totalbox box3">
                  <div class="box_title">채집백</div>
                  <div class="box_value">교환필요</div>
                </div>
                <div class = "totalbox box4">
                  <div class="box_title">상태</div>
                  <div class="box_value">채취대기</div>
                </div>
                <div class = "totalbox box5">
                  <div class="box_title">채취시간</div>
                  <div class="box_value">
                    <div class="box_value1">04.13 11:22</div>
                    <div class="box_value2">04.13 11:24</div>
                  </div>
                </div>
              </div>
            </div>
            <div id="CollectorBody" v-show="isCollectShow">
              <div class="collectorHeader">
                <div class="checked">
                  <input id="allCheck" type="checkbox" value="selectAll"/>
                </div>
                <div class="name">장비ID</div>
                <div class="mode">모드</div>
                <div class="bag">채취백</div>
                <div class="status">동작상태</div>
                <div class="start">시작</div>
              </div>
              <div id="collectorList" class="collectorList">
                <div class="collectorItem">
                  <div class="checked line">
                    <input class="collector_td_ck_1" type="checkbox" name="collectorCk" value="1">
                  </div>
                  <div class="line name">산동농장</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취대기</div>
                  <div class="line start">
                    <i class="fas fa-play"></i>
<!--                    <i class="fas fa-spinner fa-spin"></i>-->
<!--                    <i class="fas fa-exchange-alt"></i>-->
                  </div>
                </div>
                <div class="collectorItem">
                  <div class="checked line">
                    <input class="collector_td_ck_1" type="checkbox" name="collectorCk" value="2">
                  </div>
                  <div class="line name">누리화학</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취중</div>
                  <div class="line start">
                    <!--                    <i class="fas fa-play"></i>-->
                    <i class="fas fa-spinner fa-spin"></i>
                    <!--                    <i class="fas fa-exchange-alt"></i>-->
                  </div>
                </div>
                <div class="collectorItem">
                  <div class="checked line">
                    <input class="collector_td_ck_1" type="checkbox" name="collectorCk" value="3">
                  </div>
                  <div class="line name">에이스농장</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취완료</div>
                  <div class="line start">
<!--                <i class="fas fa-play"></i>-->
<!--                <i class="fas fa-spinner fa-spin"></i>-->
                    <i class="fas fa-exchange-alt"></i>
                  </div>
                </div>
              </div>
              <div class="collectorBtn">
                <div onclick="startCollectorSelected()">선택시작</div>
              </div>
            </div>
          </div>


          <div id="showChartArea" v-show="!isCollectShow">
            <span>악취정보</span>
            <div id="chartBar"></div>
          </div>
          <div id="showWindRoseArea" v-show="!isCollectShow">
            <span>풍배도</span>
            <div id="windRose"></div>
            <div class="showWindCount" @click="isWindChartView=true">상세보기</div>
            <div class="windLegend">
              <div class="windLevel windLevel_1">
                <div class="color"></div>
                <div class="text">< 5 m/s</div>
              </div>
              <div class="windLevel windLevel_2">
                <div class="color"></div>
                <div class="text">5-8 m/s</div>
              </div>
              <div class="windLevel windLevel_3">
                <div class="color"></div>
                <div class="text">8-11 m/s</div>
              </div>
              <div class="windLevel windLevel_4">
                <div class="color"></div>
                <div class="text">> 11 m/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="rightArea">
        <div id="map"></div>
<!--        <div class="button-group">
          <button @click="changeSize(0)">Hide</button>
          <button @click="changeSize(400)">show</button>
          <button @click="displayMarker(markerPositions)">marker set</button>
          <button @click="displayMarker([])">marker set(empty)</button>
          <button @click="displayInfoWindow">infowindow</button>
        </div>-->
      </div>
      <windChartView v-if="isWindChartView" @windChart-close="isWindChartView=false">
        <Content />

      </windChartView>
    </div>

  </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import MainHeader from "../layout/header";
import dotenv from 'dotenv';
import getWindRose from "../statistics/chart_attribute/windrose.js";
import getLineChart from '../statistics/chart_attribute/lineChart.js';
//plotly 설정 언어 변경
import getPlotlyLang from '../statistics/chart_attribute/plotlyKoreanSetting.js';
import axios from "axios";
import $ from 'jquery';
import windChartView from '../../components/popup/winChartPopup';

// JQUERY //
$(document).on('click', '#allCheck', function () {
  if($('#allCheck').is(':checked')) {
    $('input[name=collectorCk]').prop('checked', true);
  } else {
    $('input[name=collectorCk]').prop('checked', false);
  }
});
$(document).on('click', 'input[name=collectorCk]', function () {
  if($('#allCheck').is(':checked')) {
    $('input[name=collectorCk]').prop('checked', true);
  } else {
    $('input[name=collectorCk]').prop('checked', false);
  }
})


/*API 키*/
dotenv.config();
let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
/**/
/*Store helper*/

export default {
  name: 'monitoring',
  components: {
    windChartView,
    'main-header': MainHeader
  },
  data: function () {
    return {
      currentTab: 0,
      selectOptions: [],
      map: null,
      equipNum: 0,
      markerPositions: [],
      markers: [],
      Point: null,
      infowindow: null,
      windRose: getWindRose,
      lineChart: getLineChart,
      responsive: true,
      isWindChartView: false,
      isCollectShow: false,
    };
  },
  created() {
    this.$root.$refs.MonitoringPage = this;
  },
  mounted() {
    this.getEquipmentList();
    this.displayMarker();
    this.mainGetData();
    this.connect();
    /*setInterval(this.connect.bind(this),30000)*/
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);

      window.onload = function () {
        Plotly.relayout('chartBar', {
          'xaxis.autorange': true,
          'yaxis.autorange': true,
          'layout.autosize': true,
        });
        window.onresize = function () {
          Plotly.relayout('chartBar', {
            'xaxis.autorange': true,
            'yaxis.autorange': true,
            'layout.autosize': true,
          });
        };
      }
    };
  },
  methods: {
    /*웹소켓 파트 시작*/
    async connect() {
      this.socket = new WebSocket("wss://echo.websocket.org");
      this.socket.onopen = () => {
        this.status = "connected";
        this.logs.push({event: "연결 완료: ", data: 'wss://echo.websocket.org'})

        this.socket.onmessage = ({data}) => {
          this.logs.push({event: "메세지 수신", data});
        };
      };
      await this.disconnect();
    },
    async disconnect() {
      this.socket.close();
      this.status = "disconnected";
      this.logs = [];
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

          //만약 장비 정보가 있을 경우 첫번째 장비를 자동으로 선택한다.
          if(this.selectOptions.length !== 'undefined'){
            $("#equipSelect optgroup option:first").attr("selected", "selected");
          }
        }
      })
    },
    /*웹소켓 파트 끝*/
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);
    },
    showWindChart() {
      this.infoWindChart = !this.infoWindChart;
    },
    collectorControllView() {
      this.isCollectShow = !this.isCollectShow;
    },
    /*changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },*/
    displayMarker() {
      console.log("데이터 : ",this.markerPositions)
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = this.markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        this.markers = positions.map(
          (position) =>
            new kakao.maps.Marker({
              map: this.map,
              position,
            })
        );

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );

        this.map.setBounds(bounds);
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
    setEquipCood(equipMapNum, mapLat, mapLng) {
      console.log("arr : ", equipMapNum, mapLat, mapLng)

      let imageSrc = require('../../assets/images/svg/marker_image.svg'),
        imageSize = new kakao.maps.Size(35, 45),
        imageOption = {offset: new kakao.maps.Point(15, 40)};
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      this.Point = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(mapLat, mapLng),
        title: '장비 좌표 수정',
        image: markerImage
      })
    },
    mainGetData() {
      this.getChartData();
      this.getWindData();
    },
    getChartData() {
      axios({
        url: "/equipment/getSensorChartData",
        method: "GET",
        params: {
          equipNum: this.equipNum
        }
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          Plotly.newPlot("chartBar", this.lineChart.chartDraw(data.sensorChartList), this.lineChart.layout, this.options);
          getPlotlyLang.changePlotlyLang();
        }
      })
    },
    getWindData() {
      axios({
        url: "/equipment/getWindChartData",
        method: "GET",
        params: {
          equipNum: this.equipNum
        }
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          Plotly.newPlot("windRose", this.windRose.windRoseDraw(data.windChartList), this.windRose.layout, this.options);
          getPlotlyLang.changePlotlyLang();
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
