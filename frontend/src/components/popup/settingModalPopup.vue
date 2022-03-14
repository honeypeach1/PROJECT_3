<template>
  <div class="modal">
    <div class="overlay" @click="$emit('setting-close')"></div>
    <div class="setting-modal-card">
      <!--토글 헤더 탭-->
      <div class="setting-modal-head">
        <div class="setting-modal-left" :class="{select: (show_toggle==true)}" @click="show_setting_toggle(true)">기준치 설정</div>
        <div class="setting-modal-right" :class="{select: (show_toggle==false)}" @click="show_setting_toggle(false)">장비명 설정</div>
      </div>
      <!--기준치 설정 탭-->
      <div class="standard-setting-area" v-if="show_toggle==true">
        <!--equipment name select area-->
        <div>
        <div class="standard-select-name">장비선택</div>
        <select class="settingMapSelectList" v-model="equipSettingNum" @change="getSettingData">
          <option value="0" selected disabled>장비를 선택해주세요.</option>
          <optgroup v-for="(group, name) in selectSettingOptions" :label="name">
            <option v-for="option in group" :value="option.value">
              {{ option.text }}
            </option>
          </optgroup>
        </select>
        </div>
        <!--equipment threshold setting area-->
        <div class="equipment-setting-table-area">
          <table class="equipment-table">
            <thead>
              <tr>
                <td>종류</td>
                <td>주의</td>
                <td>경고</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>복합악취</td>
                <td>
                  <input type="number">이상
                </td>
                <td>
                  <input type="number">이상
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--장비 명 설정 탭-->
      <div class="equipment-setting-area" v-if="show_toggle==false">
        <table class="equipment-name-table">
          <thead>
            <tr>
              <td>장비명</td>
              <td>설정</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input placeholder="지코바">
              </td>
              <td>
                <button>변경하기</button>
                <button>초기화</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--하단 버튼 클릭 영역-->
      <div class="bottom-button-area">
        <button class="bottom-button save">저장</button>
        <button class="bottom-button enable">적용</button>
        <button class="bottom-button close" @click="$emit('setting-close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      show_toggle: true,
      equipSettingNum: 0,
      selectSettingOptions: {
        'AMS-1000': [
          {text: 'BBQ치킨', value: 1},
          {text: '지코바', value: 2}
        ],
        'AMS-2000': [
          {text: '피자나라치킨공주', value: 3},
          {text: '맛초킹', value: 4}
        ]
      },
    }
  },
  methods: {
    getSettingData() {

    },
    show_setting_toggle(bool){
      (bool == true ? (this.show_toggle = true):(this.show_toggle = false));
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/settingModal";
</style>
