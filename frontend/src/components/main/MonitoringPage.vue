<template>
  <div id="body-wrapper">
    <div id="header" style="height: 8%">
      <main-header v-bind:currentTab="currentTab"/>
    </div>

    <div id="body-content">
      <div id="leftArea">
        <div id="equipmentListArea">
          <div id="HeaderArea">
            <select>
              <option value="0" selected disabled>장비를 선택해주세요.</option>
              <optgroup v-for="(group, name) in options" :label="name">
                <option v-for="option in group" :value="option.value">
                  {{ option.text }}
                </option>
              </optgroup>
            </select>
          </div>
          <div id="sensorArea">
            <div class="sensorData" id="sensor_1"></div>
            <div class="sensorData" id="sensor_2"></div>
            <div class="sensorData" id="sensor_3"></div>
            <div class="sensorData" id="sensor_4"></div>
          </div>
          <div id="windArea">
            <div class="wind_head_area">
              <div class="wind_head_name_area">
                풍향(wind direction)
              </div>
            </div>
            <div class="wind_data_area">
              <img class="wind_image" src="../../assets/images/svg/Windrose.svg"/>
            </div>
            <div class="wind_name_area">
              <div class="wind_name_data_area">
                북서(NW)
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
    </div>

  </div>
</template>

<script>
import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';
import MainHeader from "../layout/header";
import dotenv from 'dotenv';

/*API 키*/
dotenv.config();
let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
/**/
/*Store helper*/
const monitorHelper = createNamespacedHelpers('');

export default {
  components: {
    'main-header': MainHeader,
  },
  computed: {

  },
  data: function () {
    return {
      currentTab: 0,
      user_info: this.$route.params.user_info,
      options: {
        'AMS-1000': [
          {text: 'BBQ치킨', value: 1},
          {text: '지코바', value: 2}
        ],
        'AMS-2000': [
          {text: '피자나라치킨공주', value: 3},
          {text: '맛초킹', value: 4}
        ]
      },
      map: null,
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
      infowindow: null,
    };
  },
  mounted() {
    this.connect();
    console.log("유저 인포111 : ",this.$route.params.user_info)

    /*setInterval(this.connect.bind(this),30000)*/
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);
    }
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
          alert("data : " + data)
        };
      };
      await this.disconnect();
    },
    async disconnect() {
      this.socket.close();
      this.status = "disconnected";
      this.logs = [];
    },
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
  },
}

</script>

<style lang="scss" scoped>
@import '../../assets/style/main/monitoring';
</style>
