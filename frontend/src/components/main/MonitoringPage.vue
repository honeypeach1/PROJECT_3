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
                  <div class="box_value mode">수동</div>
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
                  <label for="ck_1">
                  <div class="checked line">
                    <input class="collector_td_ck_1" id="ck_1" type="checkbox" name="collectorCk" value="1">
                  </div>
                  <div class="line name">산동농장</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취대기</div>
                  <div class="line start">
                    <button>
                      <i class="fas fa-play"></i>
                    </button>
<!--                    <i class="fas fa-spinner fa-spin"></i>-->
<!--                    <i class="fas fa-exchange-alt"></i>-->
                  </div>
                  </label>
                </div>
                <div class="collectorItem">
                  <label for="ck_2">
                  <div class="checked line">
                    <input class="collector_td_ck_1" id="ck_2" type="checkbox" name="collectorCk" value="2">
                  </div>
                  <div class="line name">누리화학</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취중</div>
                  <div class="line start">
                    <!--                    <i class="fas fa-play"></i>-->
                    <button>
                      <i class="fas fa-spinner fa-spin"></i>
                    </button>
                    <!--                    <i class="fas fa-exchange-alt"></i>-->
                  </div>
                  </label>
                </div>
                <div class="collectorItem">
                  <label for="ck_3">
                  <div class="checked line">
                    <input class="collector_td_ck_1" id="ck_3" type="checkbox" name="collectorCk" value="3">
                  </div>
                  <div class="line name">에이스농장</div>
                  <div class="line mode">수동</div>
                  <div class="line bag">미수거</div>
                  <div class="line status">채취완료</div>
                  <div class="line start">
<!--                <i class="fas fa-play"></i>-->
<!--                <i class="fas fa-spinner fa-spin"></i>-->
                    <button>
                      <i class="fas fa-exchange-alt"></i>
                    </button>
                  </div>
                  </label>
                </div>
              </div>
              <div class="collectorBtn">
                <div @click="startCollectorSelected()">선택시작</div>
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

/*$(document).on('click', 'input[name=collectorCk]', function () {
  if($('#allCheck').is(':checked')) {
    $('input[name=collectorCk]').prop('checked', true);
  } else {
    $('input[name=collectorCk]').prop('checked', false);
  }
})*/

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
      polyline: [],
      Point: null,
      windRose: getWindRose,
      lineChart: getLineChart,
      responsive: true,
      isWindChartView: false,
      isCollectShow: false,
      customOverlay: [],
      /*startX: null,
      startY: null,
      startOverlayPoint: null,*/
      socket: null,
      status: null,
      logs: []
    };
  },
  created() {
    this.$root.$refs.MonitoringPage = this;
  },
  mounted() {
    /*$(".collectorItem").on('click', function() {
      console.log("체크 확인 : ",$(this).children(".checked").children("input").checked())
      $(this).children(".checked").children("input").prop('checked',true);
    });*/
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
    //센서 최신 데이터 가져오기
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
    //맵 사이즈 변경 함수
    /*changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },*/
    displayMarker() {
      /*if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }*/
      let imageSrc = require('../../assets/images/map/marker_image_2.png'),
        imageSize = new kakao.maps.Size(35, 75),
        imageOption = {offset: new kakao.maps.Point(15, 40)};
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      //마커 포지션 루프 시작
      this.markerPositions.forEach((datas) => {
        const markers = new kakao.maps.Marker({
          map: this.map,
          title: datas.equipment_name,
          position: new kakao.maps.LatLng(datas.equipment_lat,datas.equipment_lng),
          image: markerImage
        });

        let content = document.createElement('div');
        content.className = 'overlayInforWindow';
        content.innerHTML = `<div class="wrap" style="background: #2f4a5a; border-radius: 5px; position: absolute; padding: 5px; left: 0; bottom: 40px; width: 350px; height: 210px; margin-left: -144px; text-align: left; overflow: hidden; font-size: 12px; font-family: "NanumSquare"; line-height: 1.5;">
                                <div class="info" style="width: 100%; height: 100%;">
                                <div class="topArea" style="height: 15%; width: 100%; float: left; color: #FFFFFF">
                                    <div class="title" style="width: 100%; height: 20%; text-align: center; font-size: 20px; font-weight: bold;">
                                         ` + datas.EQUIPMENT_NAME + `
                                        <div class="close" onclick="this.closeOverlay()" title="닫기"></div>
                                    </div>
                            </div>
                                 <div class="leftArea" style="background: #1c2e37; float:left; width: 45%; height: 75%;">
                                    <div class="topBody" style="width: 100%; height: 15%; color: #FFFFFF; text-align: center; font-size: 15px; line-height: 23px;">복합악취</div>
                                    <div class="centerBody" style="height: 70%; width: 100%">
                                        <div class="todValue" style="height: 75%; width: 100%; text-align: center;">
                                           <span style="font-size: 5rem; font-weight: bold; color: chocolate">
                                         ` + (datas.TOD != 'NULL' ? datas.TOD: '-') + `
                                           </span>
                                       </div>
                                    </div>
                                 <div class="bottomBody" style="width: 100%; height: 15%; font-size: 15px; color: #f1f1f1; text-align: center; font-weight: bold">(배수)</div>
                                 </div>
                                 <div class="rightArea" style="float:left; width: 55%; height: 75%; background: #bdc9e9">
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">황화수소</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.H2S != 'NULL' ? datas.H2S: '-') + `
                                   (ppb)</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">암모니아</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.NH3 != 'NULL' ? datas.NH3: '-') + `
                                   (ppb)</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">MOS</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.MOS != 'NULL' ? datas.MOS: '-') + `
                                   (OU)</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">전압</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.BTV != 'NULL' ? datas.BTV: '-') + `
                                   V</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">함체 온도</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.ITT != 'NULL' ? datas.ITT: '-') + `
                                   (°C)</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">함체 습도</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.OTH != 'NULL' ? datas.OTH: '-') + `
                                    %</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">풍향</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">` + this.windDirect(datas.OWD) + `</div>
                                   <div class="sensor title" style="float:left; height: 12.5%; font-weight: bold; text-align: center; background: #eef1f5; width: 50%">풍속</div>
                                   <div class="sensor value" style="float:left; height: 12.5%; width: 50%">
                                   ` + (datas.OWS != 'NULL' ? datas.OWS: '-') + `
                                   m/s</div>
                                </div>
                                <div class="bottomArea" style="width: 100%; color: #FFFFFF; line-height: 22px; height: 10%; float: left; text-align: center">
                                <div class="time" style="font-size: 0.9rem; text-align: left;">측정시각 :
                                ` + (datas.data_date_time != 'NULL' ? datas.DATA_DATE_TIME: '-') + `
                                </div>
                            </div>`

        this.customOverlay = new kakao.maps.CustomOverlay({
          yAnchor: 1,
          map: this.map,
          content: content,
          position: markers.getPosition(),
        })

        //마커 클릭 이벤트 - 셀렉트 리스트 클릭 장비, 데이터 가져오기
        kakao.maps.event.addListener(markers,'click',() => {
          $("#equipSelect").val(datas.equipment_seq).prop("selected", true);

          this.equipNum = $("#equipSelect").val();
          //중심 좌표 이동
          let movePoint = new kakao.maps.LatLng(datas.equipment_lat, datas.equipment_lng);
          this.map.panTo(movePoint);
          //클릭 이벤트내에서 통계 데이터 가져오기
          this.mainGetData();
        });
        let mapInfor = this.map;
        let overlayInfor = this.customOverlay;

        let startX, startY, startOverlayPoint;
        addEventHandle(content, 'mousedown', onMouseDown);
        addEventHandle(document, 'mouseup', onMouseUp);

        function closeOverlay(){
          this.customOverlay.setMap(null);
        }

        function onMouseDown(e){
          if(e.preventDefault){
            e.preventDefault();
          }else{
            e.returnValue = false;
          }

          let proj = mapInfor.getProjection(),
            overlayPos = overlayInfor.getPosition();

          kakao.maps.event.preventMap();

          startX = e.clientX;
          startY = e.clientY;
          startOverlayPoint = proj.containerPointFromCoords(overlayPos);
          addEventHandle(document, 'mousemove', onMouseMove)
        }

        function onMouseUp(){
          removeEventHandle(document, 'mousemove', onMouseMove)
        }

        function addEventHandle(target, type, callback) {
          if(target.addEventListener){
            target.addEventListener(type, callback);
          } else {
            target.attachEvent('on'+type,callback);
          }
        }

        function removeEventHandle(target, type, callback) {
          if(target.removeEventListener){
            target.removeEventListener(type, callback);
          } else {
            target.detachEvent('on'+type,callback);
          }
        }

        let polyline;

        function onMouseMove(e){
          if(polyline != null){
            polyline.setMap(null);
          }
          if(e.preventDefault()){
            e.preventDefault();
          }else{
            e.returnValue = false;
          }
          let proj = mapInfor.getProjection(),
            deltaX = startX - e.clientX,
            deltaY = startY - e.clientY,
            newPoint = new kakao.maps.Point(startOverlayPoint.x - deltaX, startOverlayPoint.y - deltaY),
            newPos = proj.coordsFromContainerPoint(newPoint);


          /*
            바로 커스텀 오버레이 좌표로 마커 좌표와 연결하는 라인을 생성시 이상하게 나와서
            커스텀 오버레이 좌측 상단 꼭지점 좌표로 바꾸기 위해서 좌표를 약간 깎기? 위해서 아래 생성
          */
          let polyPoint = new kakao.maps.Point(startOverlayPoint.x - (deltaX + 140), startOverlayPoint.y - (deltaY + 255)),
            newPolyPos = proj.coordsFromContainerPoint(polyPoint);
          let lineCoord = [
            //마커의 좌표
            new kakao.maps.LatLng(datas.equipment_lat, datas.equipment_lng)
          ];
          lineCoord.push(newPolyPos);
          console.log('폴리라인 : ',lineCoord)

          //마커와 장비 커스텀 오버레이(정보창)과 연결하는 라인 생성
          polyline = new kakao.maps.Polyline({
            map: mapInfor,
            path: lineCoord,        // 선을 구성하는 좌표 배열
            strokeWeight: 3,        // 선의 두께
            strokeColor: '#596389', // 선의 색상
            strokeOpacity: 0.3,     // 선의 불투명도 표시
            strokeStyle: 'solid'    // 선의 스타일
          })
          overlayInfor.setPosition(newPos);
        }
        ////////////////////////////////////////////////////////////
      })
    },
    windDirect(data){
      let check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\-]/;
      let windData;
      let result;
      if(check.test(data)) {
        windData = 0;
        return "-";
      }
      else {
        windData = parseInt(data);
      }
      if (windData < 0) windData = 0;
      else if (windData == 16) windData = 0;
      switch (windData) {
        case 0: result="북";break;
        case 1: result="북북동";break;
        case 2: result="북동";break;
        case 3: result="동북동";break;
        case 4: result="동";break;
        case 5: result="동남동";break;
        case 6: result="남동";break;
        case 7: result="남남동";break;
        case 8: result="남";break;
        case 9: result="남남서";break;
        case 10: result="남서";break;
        case 11: result="서남서";break;
        case 12: result="서";break;
        case 13: result="서북서";break;
        case 14: result="북서";break;
        case 15: result="북북서";break;
      }
      return result;
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
    startCollectorSelected() {
      let checkDataList = [];
      $("input[name=collectorCk]:checked").each((index,val) => {
        //val은 HTML DOM 형식으로 가져옴. -> <input class="collector_td_ck_1" type="checkbox" name="collectorCk" value="2">
        //즉 DOM 구조에서 가져올 속성(Attribute)의 속성값(value)를 지정하면 해당 선택 체크 박스 로우의 value값(장비 번호)을 가져 올 수 있음.
        checkDataList.push(val.getAttribute('value'));
      });

      /*
        프로세스 로직 설명
        선택 장비들(한대에서 다수)에 대한 채취 명령 전송 로직

        1. 단일 명령 처리(체크 박스에 대한 채취 명령 전송 메소드를 가져와서 each문에 전송
           체크된 반복문에서 명령 전송, 명령 전송,...
           단일 처리를 위한 백엔드 메소드를 만들어 받은 데이터를 한개씩 소켓 리턴 데이터를 전송 설계

        2. 다수 명령 처리(list)를 채취 명령 받는 백엔드 메소드에서 소수든 다수든 처리
           체크 박스 리스트를 벡엔드 데이터에 전송
           해당 메소드는 재활용성에 의거 단일 데이터나 리스트 데이터를 받아 각기 다른 장비들에 대하여
           소켓 리턴 데이터를 전송하게 설계
      */


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

if('/monitoring' === window.location.pathname){
  console.log('monitoring 동작')
window.onresize = function () {
    Plotly.relayout('chartBar', {
      'xaxis.autorange': true,
      'yaxis.autorange': true,
      'witdh': $('#chartBar').width() - '10px'
    });
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
