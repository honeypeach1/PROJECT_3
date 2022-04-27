<template>
  <div class="modal">
    <div class="overlay" @click="$emit('map-close')"></div>
    <div class="map-modal-card">
      <div class="map-headerTab">맵 좌표 설정</div>
      <div class="map-tab-content">
        <div class="map-tab-panel">
          <table class="map-modal-table">
            <thead>
              <tr>
                <td>장비명</td>
                <td>좌표설정</td>
              </tr>
            </thead>
            <tbody>
            <template v-for="dataList in mapEquipmentList">
              <tr>
                <td>
                  <input class="map_equipment_name" :id="'mapEquipment_'+dataList.EQUIPMENT_SEQ" :placeholder="dataList.EQUIPMENT_NAME">
                </td>
                <td>
                  <button class="map_change_Equip" @click="setEquipCood(dataList.EQUIPMENT_SEQ,dataList.EQUIPMENT_LAT,dataList.EQUIPMENT_LNG)">좌표설정</button>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="map-tab-init">
        <div class="init-left-area">초기 맵 좌표 설정</div>
        <div class="init-right-area">
          <input class="init-map-button" type="button" @click="accountCoord" value="좌표설정">
        </div>
      </div>
      <div class="map-tab-bottom">
        <button class="map-tab-close" @click="$emit('map-close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from "axios";

export default {
  data: function () {
    return {
      mapEquipmentList: []
    }
  },
  mounted() {
    this.getMapEquipmentList();
  },
  methods: {
    getMapEquipmentList() {
      axios({
        url: "/equipment/getEquipmentList",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.mapEquipmentList = data.equipmentList;
        }
      })
    },
    setEquipCood(equipMapNum,mapLat,mapLng){
      this.$emit('map-close');
      this.$root.$refs.MonitoringPage.setEquipCood(equipMapNum,mapLat,mapLng);
    },
    accountCoord(){
      this.$emit('map-close');
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/mapModal";
</style>
