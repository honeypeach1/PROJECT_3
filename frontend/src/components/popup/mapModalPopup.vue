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
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="map-tab-init">
        <div class="init-left-area">초기 맵 표 설정</div>
        <div class="init-right-area">
          <input class="init-map-button" type="button" value="좌표설정">
        </div>
      </div>
      <div class="map-tab-bottom">
        <button class="map-tab-close" @click="$emit('map-close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {}
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/mapModal";
</style>
