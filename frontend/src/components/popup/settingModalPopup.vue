<template>
  <div class="modal">
    <div class="overlay" @click="$emit('setting-close')"></div>
    <div class="setting-modal-card">
      <!--토글 헤더 탭-->
      <div class="setting-modal-head">
        <div class="setting-modal-left" :class="{select: (show_toggle==true)}" @click="show_setting_toggle(true,1)">기준치
          설정
        </div>
        <div class="setting-modal-right" :class="{select: (show_toggle==false)}" @click="show_setting_toggle(false,2)">장비명
          설정
        </div>
      </div>
      <!--기준치 설정 탭-->
      <div class="standard-setting-area" v-if="show_toggle==true">
        <!--equipment name select area-->
        <div>
          <div class="standard-select-name">장비선택</div>
          <select class="settingMapSelectList" v-model="equipSettingNum" @change="getEquipmentThresholdValue">
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
                <input type="number" id="TODCaution" min="1" max="10" :placeholder="threshCautionValue"
                       @keyup="this.threshValue = minMax(this.threshValue, 1, 10)">이상
              </td>
              <td>
                <input type="number" id="TODWarning" min="1" max="100" :placeholder="threshWarningValue"
                       @keyup="this.threshValue = minMax(this.threshValue, 1, 100)">이상
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
                  <template v-for="dataList in equipList">
                    <tr>
                      <td>
                        <input class="equipment_name" :placeholder="dataList.EQUIPMENT_NAME">
                      </td>
                      <td>
                        <button class="change_Equip" @click>변경하기</button>
                        <button class="reset_Equip" @click="resetRow">초기화</button>
                        <button class="delete_Equip">삭제</button>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
        </div>

        <!--하단 버튼 클릭 영역-->
        <div class="bottom-button-area">
          <button class="bottom-button save" v-if="this.show_button = show_button" @click="saveThreshValue">저장</button>
          <button class="bottom-button enable" v-if="this.show_button = show_button" @click="enableThreshValue">적용</button>
          <button class="bottom-button close" @click="$emit('setting-close')">닫기</button>
        </div>
      </div>
    </div>
</template>

<script>
import $ from 'jquery';
import axios from "axios";
import router from '../../router'

export default {
  data: function () {
    return {
      show_toggle: true,
      threshValue: null,
      threshCautionValue: null,
      threshWarningValue: null,
      equipSettingNum: 0,
      equipmentName: '',
      equipNum: 1,
      equipList: [],
      show_button: true,
      selectSettingOptions: []
    }
  },
  mounted() {
    this.getEquipmentThreshold();
  },
  methods: {
    minMax(value, min, max) {
      if (value == "" || value == undefined) {
        return null;
      }
      if (parseInt(value) < min || isNaN(parseInt(value))) {
        return min;
      } else if (parseInt(value) > max) {
        return max;
      } else {
        return value;
      }
    },
    getEquipmentThreshold() {
      //해당 메소드가 실행될때 다시 한번 초기화 진행
      this.selectSettingOptions = [];
      axios({
        url: "/equipment/getThreshold",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.selectSettingOptions = data.equipmentList;
        }
      })
    },
    getEquipmentList() {
      axios({
        url: "/equipment/getEquipmentList",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.equipList = data.equipmentList;
        }
      })
    },
    getEquipmentThresholdValue() {
      axios({
        url: "/equipment/getThresholdValue",
        method: "GET",
        params: {
          equipSettingNum: this.equipSettingNum
        }
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.threshCautionValue = '사용 안함';
          this.threshWarningValue = '사용 안함';
          for(let thresholdValue of data.thresholdValue){
            this.equipmentName = thresholdValue.equipment_name;
            //악취 주의 값(1) - 악취 주의와 경고만 있음. 이외는 좋음으로 표시됨.
            if(thresholdValue.threshold_over_event_type_seq == 1){
              this.threshCautionValue = thresholdValue.threshold_over_event_values;
            //악취 경고
            }else{
              this.threshWarningValue = thresholdValue.threshold_over_event_values;
            }
          }
        }
      })
    },
    saveThreshValue() {
      let saveEquipNum = this.equipSettingNum;
      if (saveEquipNum == 0) {
        alert('장비를 선택하셔야 합니다.');
        return;
      } else {
        alert(this.equipmentName + ' 장비 설정이 저장 되었습니다. 팝업창을 닫습니다.');
        router.go();
      }
    },
    enableThreshValue() {
      let enableEquipNum = this.equipSettingNum;
      if (enableEquipNum == 0) {
        alert('장비를 선택하셔야 합니다.');
        return;
      } else {
        alert(this.equipmentName + ' 장비 설정이 적용 되었습니다.');
      }
    },
    resetRow(){
      console.log($(this).closest('td').find('.equipment_name'))
      console.log($(this).closest('tr').find('.equipment_name'))
      return $(this).closest('td').find('.equipment_name').val(null);
    },
    show_setting_toggle(bool,num) {
      (bool == true ? (this.show_toggle = true) : (this.show_toggle = false));
      //기준치 설정
      //equipNum -> 처음 해당 팝업 페이지를 호출할때, 기준치 설정을 불러옴. 즉, 똑같은 페이지 접근시 막기 처리
      if(num === 1 && this.equipNum != 1){
        this.equipNum = 1;
        this.show_button = true;
        //새로 불러오기
        this.getEquipmentThreshold();
      //장비명 설정
      //장비명 설정에서는 저장, 적용 버튼이 필요가 없어서 버튼을 동적으로 생성하지 않음.(show_button = false)
      }else if(num === 2 && this.equipNum != 2){
        this.equipNum = 2;
        this.show_button = false;
        //장비 명 가져오기
        this.getEquipmentList();
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/settingModal";
</style>
