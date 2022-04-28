<template>
  <div id="body-wrapper">
    <div id="header">
      <main-header v-bind:currentTab="currentTab"/>
    </div>

    <div id="body-content">
      <div id="leftArea">
        <div id="equipmentListArea">
          <div id="HeaderArea">
            <select v-model="equipNum" @change="mainGetData">
              <option value="0" selected disabled>장비를 선택해주세요.</option>
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
              <a class="collectarea" onclick="collectorControllView()">
                <div>
                  <span class="rightSpan">동작</span>
                  <img id="collectorBtn" src="../../assets/images/layout/btn_down.png" alt="temp"/>
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
          </div>
          <div id="showChartArea">
            <span>악취정보</span>
            <div id="chartBar"></div>
          </div>
          <div id="showWindRoseArea">
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
        <div class="button-group">
          <button @click="changeSize(0)">Hide</button>
          <button @click="changeSize(400)">show</button>
          <button @click="displayMarker(markerPositions1)">marker set 1</button>
          <button @click="displayMarker(markerPositions2)">marker set 2</button>
          <button @click="displayMarker([])">marker set 3 (empty)</button>
          <button @click="displayInfoWindow">infowindow</button>
        </div>
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
import axios from "axios";
import $ from 'jquery';
import windChartView from '../../components/popup/winChartPopup';

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
      markerPositions1: [
        [33.452278, 126.567803],
        [33.452671, 126.574792],
        [33.451744, 126.572441],
      ],
      markerPositions2: [
        [37.499590490909185, 127.0263723554437],
        [37.499427948430814, 127.02794423197847],
        [37.498553760499505, 127.02882598822454],
        [37.497625593121384, 127.02935713582038],
        [37.49629291770947, 127.02587362608637],
        [37.49754540521486, 127.02546694890695],
        [37.49646391248451, 127.02675574250912],
      ],

      markers: [],
      Point: null,
      infowindow: null,
      windRose: getWindRose,
      lineChart: getLineChart,
      responsive: true,
      isWindChartView: false,
    };
  },
  created() {
    this.$root.$refs.MonitoringPage = this;
  },
  mounted() {
    this.getEquipmentList();
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
      this.mainGetData();
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
    }
    ;
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
        }
      })
    },
    /*    initPlotlyChart() {
          Plotly.newPlot("windRose", this.windRose.data, this.windRose.layout, this.options);
          Plotly.newPlot("chartBar", this.lineChart.data, this.lineChart.layout, this.options);
        },*/
    /*
        sendMessage(e) {
          this.socket.send(this.message);
          this.logs.push({ event: "메시지 전송", data: this.message });
          this.message = "";
        },*/
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
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    displayMarker(markerPositions) {
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
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
        }
      })
    }
  },
}

</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
