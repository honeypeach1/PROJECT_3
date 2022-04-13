<template>
  <div class="modal">
    <div class="overlay" @click="$emit('equip-close')"></div>
    <div class="equipment-modal-card">
      <div class="equipment-headerTab">장비 등록</div>
      <form id="register_equipment_form" @submit.prevent="registerEquipment">
        <table class="equipment-modal-table">
          <tbody>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">장비명</td>
            <td class="table_equipment_tbody_td_data">
              <input class="input-data-long" type="text" v-model="equipment_name" placeholder="장비명을 입력하세요." required>
            </td>
          </tr>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">타입</td>
            <td class="table_equipment_tbody_td_data">
              <select class="input-data-short" v-model="equipment_type" required>
                <option value="" disabled selected>타입을 선택하세요</option>
                <option value="1">센서측정장비</option>
                <option value="2">채취측정장비</option>
                <option value="3">분석장비</option>
              </select>
            </td>
          </tr>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">장비위치</td>
            <td class="table_equipment_tbody_td_data">
              <div id="registerMap"></div>
              <div id="registerLat">
                위도 :
                <input type="number" id="equipment_lat" v-model="equipment_lat" step="0.000000000001" readonly>
              </div>
              <div id="registerLng">
                경도 :
                <input type="number" id="equipment_lng" v-model="equipment_lng" step="0.000000000001" readonly>
              </div>
            </td>
          </tr>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">주소</td>
            <td class="table_equipment_tbody_td_data">
              <input class="input-data-long" type="text" placeholder="장비 설치 주소를 입력합니다."
                     @click="callAddress"
                     id="registerFakeAddress" readonly>
              <input type="hidden" v-model="equipment_address" id="registerRealAddress" required>
            </td>
          </tr>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">설치회사</td>
            <td class="table_equipment_tbody_td_data">
              <input class="input-data-long" type="text" placeholder="장비 설치 회사를 입력하세요."
                     v-model="equipment_company" required>
            </td>
          </tr>
          <tr class="table_equipment_tbody_tr">
            <td class="table_equipment_tbody_td_head">포트설정</td>
            <td class="table_equipment_tbody_td_data">
              <input class="input-data-short" type="number" min="1000" max="65536" placeholder="장비 연동 포트 설정"
                     oninput="this.value = (this.value > 65536 ? 65536 : this.value)"
                     v-model="equipment_port" required>
            </td>
          </tr>
          <tr class="table_equipment_tbody_end">
            <td colspan="2">
              <input class="input_button" type="submit" value="등록">
              <input class="input_button" type="reset" value="초기화">
            </td>
          </tr>
          </tbody>
        </table>
      </form>
      <div class="equipment-tab-bottom">
        <button class="equipment-tab-close" @click="$emit('equip-close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>

let KAKAO_API_KEY = process.env.VUE_APP_KAKAO_API;
export default {
  data() {
    return {
      registMap: "",
      equipment_name: "",
      equipment_type: "",
      equipment_lat: "",
      equipment_lng: "",
      equipment_address: "",
      equipment_company: "",
      equipment_port: "",
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initRegisterMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initRegisterMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + KAKAO_API_KEY + "&libraries=services";
      document.head.appendChild(script);
    }
  },
  methods: {
    initRegisterMap() {
      /*kakao 맵 기본 속성*/
      const container = document.getElementById("registerMap");
      const options = {
        //로그인한 계정의 위경도 위치 받아오기
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };
      this.registMap = new kakao.maps.Map(container, options);
      ////////////////////

      let imageSrc = require('../../assets/images/svg/marker_image.svg'),
        imageSize = new kakao.maps.Size(35, 45),
        imageOption = {offset: new kakao.maps.Point(15, 40)};
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const marker = new kakao.maps.Marker({
        map: this.registMap,
        image: markerImage,
        position: this.registMap.getCenter(),
      })

      kakao.maps.event.addListener(this.registMap, 'click', function (mouseEvent) {
        let latlng = mouseEvent.latLng;
        this.equipment_lat = latlng.getLat();
        this.equipment_lng = latlng.getLng();
        //console.log("위경도 : "+latlng)
        //마커 생성
        marker.setPosition(latlng)
        document.getElementById('equipment_lat').value = latlng.getLat();
        document.getElementById('equipment_lng').value = latlng.getLng();
      })
    },
    callAddress() {
      new window.daum.Postcode({
        oncomplete: (data) => { //function이 아니라 => 로 바꿔야한다.
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

          // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          var roadAddr = data.roadAddress; // 도로명 주소 변수
          var extraRoadAddr = ''; // 참고 항목 변수

          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraRoadAddr !== '') {
            extraRoadAddr = ' (' + extraRoadAddr + ')';
          }

          document.getElementById("registerFakeAddress").value = roadAddr;
          document.getElementById("registerRealAddress").value = roadAddr;
        }
      }).open();
    },
    registerEquipment() {
      this.$store.dispatch("REGISTEQUIPMENT", {
        equipment_name: this.equipment_name,
        equipment_type: this.equipment_type,
        equipment_lat: this.equipment_lat,
        equipment_lng: this.equipment_lng,
        equipment_address: this.equipment_address,
        equipment_company: this.equipment_company,
        equipment_port: this.equipment_port,
      })
        .then(success => {
          this.$router.go();
        })
        .catch(error => {
          this.error = true;
        })
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/registerEquipModal";
</style>
