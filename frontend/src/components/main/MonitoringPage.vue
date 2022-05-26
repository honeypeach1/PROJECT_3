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
                <option v-for="option in group" :selected="option.rownum===1" :value="option.value">
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

import Stomp from "stomp";

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
      equipNum: 1,
      markerPositions: [],
      markers: [],
      Point: null,
      infowindow: [],
      windRose: getWindRose,
      lineChart: getLineChart,
      responsive: true,
      isWindChartView: false,
      isCollectShow: false,
      customOverlay: null,
      startX: null,
      startY: null,
      startOverlayPoint: null,
      socket: null,
      status: null,
      logs: []
    };
  },
  created() {
    this.$root.$refs.MonitoringPage = this;
  },
  mounted() {
    /*setInterval(this.connect.bind(this),30000)*/
    if (!window.kakao || !window.kakao.maps) {
      //스크립트 로드
      const script = document.createElement("script");
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      //script.onload = () => kakao.maps.load(this.initMap);
      document.head.appendChild(script);
      script.addEventListener("load",() => {
        kakao.maps.load(this.initMap);
      })
    } else {
      this.initMap();
    };

    //셀렉트 리스트 그룹 장비 리스트 가져오기
    this.getEquipmentList();
    //악취 센서 선형차트 & 풍배도 & 풍속빈도 처리하기
    this.mainGetData();
    //웹 소켓 연결하기
    this.connect();
  },
  methods: {
    /*웹소켓 파트 시작*/
    async connect() {
      //동일 호스트 포트를 사용하기 위한 동적 주소 처리
      let add = window.location, new_uri;
      if (add.protocol === "https:") {
        new_uri = "wss:";
      } else {
        new_uri = "ws:";
      }
      new_uri += "//" + add.host;
      new_uri += add.pathname + "/ws";
      this.socket = new WebSocket(new_uri);
      //let stompClient = Stomp.over(this.socket);
      console.log("WebSocket has connected.")
      //this.socket = new WebSocket("wss://echo.websocket.org");

      //데이터 수신 이벤트 헨들러
      this.socket.onmessage = function(event) {
        console.log('onmessage : ',event);
      }

      //소켓 연결 이벤트 헨들러
      this.socket.onopen = function(event) {
        console.log("웹소켓1")
        console.log(event)
        console.log("Successfully connected to the echo websocket server...")
      }

      //소켓 해제 이벤트 헨들러
      this.socket.onclose = function (event) {
        let reason;
        //alert(event.code);
        // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
        if (event.code == 1000)
          reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
        else if(event.code == 1001)
          reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
        else if(event.code == 1002)
          reason = "An endpoint is terminating the connection due to a protocol error";
        else if(event.code == 1003)
          reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
        else if(event.code == 1004)
          reason = "Reserved. The specific meaning might be defined in the future.";
        else if(event.code == 1005)
          reason = "No status code was actually present.";
        else if(event.code == 1006)
          reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        else if(event.code == 1007)
          reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
        else if(event.code == 1008)
          reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
        else if(event.code == 1009)
          reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
          reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
        else if(event.code == 1011)
          reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
        else if(event.code == 1015)
          reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
        else
          reason = "Unknown reason";

        console.log("Socket Error Log : ",reason)
      };

      //소켓 에러 이벤트 헨들러
      this.socket.onerror = function(event) {
        console.log('onerror : ',event)
      }

      //소켓 데이터 전송
      //this.socket.send('전송');
      //소켓 종료
      //this.socket.close();

      /*this.socket.onopen = () => {

        this.status = "connected";
        this.logs.push({event: "연결 완료: ", data: 'wss://echo.websocket.org'})

        this.socket.onmessage = ({data}) => {
          console.log("웹소켓2")

          this.logs.push({event: "메세지 수신", data});
        };
      };*/
      await this.disconnect();
    },
    async disconnect() {
      this.socket.close();
      this.status = "disconnected";
      this.logs = [];
    },
    getMapEquipmentList() {
      axios({
        url: "/equipment/getEquipmentList",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.markerPositions = data.equipmentList;
          //지도 좌표 설정하기
          this.displayMarker();
        }
      })
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
    /*웹소켓 파트 끝*/

    /*초기 맵 세팅*/
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.451616, 126.56672),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);

      //지도 좌표 설정하기
      this.getMapEquipmentList();

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
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }
      let imageSrc = require('../../assets/images/map/marker_image_2.png'),
        imageSize = new kakao.maps.Size(35, 75),
        imageOption = {offset: new kakao.maps.Point(15, 40)};
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      this.markerPositions.forEach((datas) => {
        this.markers = new kakao.maps.Marker({
          map: this.map,
          title: datas.EQUIPMENT_NAME,
          position: new kakao.maps.LatLng(datas.EQUIPMENT_LAT,datas.EQUIPMENT_LNG),
          image: markerImage
        });

        let iwContent = '<div style="padding:5px;">' + datas.EQUIPMENT_NAME + '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        this.infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: true,// removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
        });
        this.infowindow.open(this.map, this.markers);


        /*let content = document.createElement('div');
        content.className = 'overlay';
        content.innerHTML = datas.EQUIPMENT_NAME;

        this.customOverlay = new kakao.maps.CustomOverlay({
          content: content,
        })

        this.addEventHandle(content, 'mousedown', this.onMouseDown());
        this.addEventHandle(content, 'mouseup', this.onMouseUp());

        this.customOverlay.open(this.map,this.marker)*/
      })
      //this.displayInfoWindow();
     /* const positions = this.markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );
      console.log("positions : ",positions)

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
      }*/
    },
    onMouseDown(e){
      console.log("마우스 다운 : ",e)
      if(e.preventDefault()){
        e.preventDefault();
      }else{
        e.returnValue = false;
      }

      let proj = this.map.getProjection(),
        overlayPos = this.customOverlay.getPosition();

      kakao.maps.event.preventMap();

      this.startX = e.clientX;
      this.startY = e.clientY;

      this.startOverlayPoint = proj.containerPointFromCoords(overlayPos);

      this.addEventHandle(document, 'mousemove', this.onMouseMove())
    },
    onMouseUp(){
      this.removeEventHandle(document, 'mousemove', this.onMouseMove())
    },
    addEventHandle(target, type, callback) {
      if(target.addEventListener){
        target.addEventListener(type, callback);
      } else {
        target.attachEvent('on'+type,callback);
      }
    },
    removeEventHandle(target, type, callback) {
      if(target.removeEventListener){
        target.removeEventListener(type, callback);
      } else {
        target.detachEvent('on'+type,callback);
      }
    },
    onMouseMove(e){
      console.log("마우스 무브 : ",e)
      if(e.preventDefault()){
        e.preventDefault();
      }else{
        e.returnValue = false;
      }

      let proj = map.getProjection(),
        deltaX = this.startX - e.clientX,
        deltaY = this.startY - e.clientY,
        newPoint = new kakao.maps.Point(this.startOverlayPoint.x - deltaX, this.startOverlayPoint.y - deltaY),
        newPos = proj.coordsFromContainerPoint(newPoint);

      this.customOverlay.setPosition(newPos);
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      for (var i = 0; i < this.markerPositions.length; i++) {
        var iwContent = '<div style="padding:5px;">'+this.markerPositions[i].EQUIPMENT_NAME+'</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwPosition = new kakao.maps.LatLng(this.markerPositions[i].EQUIPMENT_LAT, this.markerPositions[i].EQUIPMENT_LNG), //인포윈도우 표시 위치입니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      }

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      //this.map.setCenter(iwPosition);
    },
    setEquipCood(equipMapNum, mapLat, mapLng) {
      console.log("arr : ", equipMapNum, mapLat, mapLng)

      let imageSrc = require('../../assets/images/map/marker_image_2.png'),
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
      console.log("this.equipNum : ",this.equipNum)
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

window.onresize = function () {
  Plotly.relayout('chartBar', {
    'xaxis.autorange': true,
    'yaxis.autorange': true,
  });
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
