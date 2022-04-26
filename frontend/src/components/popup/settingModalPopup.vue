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
                <input type="number" id="TODCaution" min="1" max="10" :placeholder="threshCautionValue">이상
<!--                       @keyup="minMax(this.threshValue, 1, 10)"-->
              </td>
              <td>
                <input type="number" id="TODWarning" min="1" max="100" :placeholder="threshWarningValue">이상
<!--                       @keyup="minMax(this.threshValue, 1, 100)"-->
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
                        <input class="equipment_name" :id="'equipment_'+dataList.EQUIPMENT_SEQ" :placeholder="dataList.EQUIPMENT_NAME">
                      </td>
                      <td>
                        <button class="change_Equip" @click="equipChange(dataList.EQUIPMENT_SEQ,dataList.EQUIPMENT_NAME)">변경하기</button>
                        <button class="reset_Equip" @click="resetRow(dataList.EQUIPMENT_SEQ)">초기화</button>
                        <button class="delete_Equip" @click="equipDelete(dataList.EQUIPMENT_SEQ,dataList.EQUIPMENT_NAME)">삭제</button>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
        </div>

        <!--하단 버튼 클릭 영역-->
        <div class="bottom-button-area">
          <button class="bottom-button save" v-if="this.show_button = show_button" @click="saveThreshValue(1)">저장</button>
          <button class="bottom-button enable" v-if="this.show_button = show_button" @click="saveThreshValue(2)">적용</button>
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
      threshValue: 0,
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
    saveThreshValue(num) {
      let saveEquipNum = this.equipSettingNum;
      let todCaution = $('#TODCaution').val();
      let todWarning = $('#TODWarning').val();

      if (saveEquipNum == 0) {
        alert('장비를 선택하셔야 합니다.');
        return;
      } else {
        /*
          파라미터 정보
          1. 장비 번호 : saveEquipNum
          2. 주의 값 : $('#TODCaution').val() 입력값 / threshCautionValue(기존값)
          3. 경고 값 : $('#TODWarning').val() 입력값 / threshWarningValue(기존값)

        * 기준치 설정 프로세스
         - 둘중에 하나만 입력해도 됨.
         - 둘다 입력할시 주의 값은 무조건 경고 값 보다 작아야 함.(각각의 INPUT 태그에서 min & max 값을 설정 해줬지만, 입력이 되는 현상이 있음.)
           주의 1 ~ 10, 경고 1 ~ 100
         - 한개의 값을 입력했을시 기존 설정 값이 있다면 기존값을 비교하여 두번째 처리를 해야함.(만약 나머지 한개의 값이 없다면 상관없음)
        */
        //주의값을 입력했을때
        if(todCaution != ''){
          //경고값도 입력했을때
          if(todWarning != ''){
            //값이 둘다 입력되었지만, 주의값이 경고값보다 만약 높으면
            if(parseInt(todCaution) >= parseInt(todWarning)){
              alert('입력하신 악취 주의 값은 악취 경고 값보다 작아야 합니다.')
              //input value 초기화
              this.initInputData();
              return;
            } else {
              //값 성공 입력 처리 axios 호출
              this.setThresholdData(saveEquipNum,todCaution,todWarning,num);
            }
          //경고값은 입력이 되지 않았을때
          } else {
            if (this.threshWarningValue == '사용 안함') {
              //값 성공 입력 처리 axios 호출
              this.setThresholdData(saveEquipNum,todCaution,todWarning,num);
            //입력한 주의값이 기존 경고값보다 클때
            }else if(parseInt(todCaution) >= parseInt(this.threshWarningValue)){
              alert('악취 주의 설정 값은 기존 경고 값보다 작아야 합니다.')
              //input value 초기화
              this.initInputData();
              return;
            } else {
              //값 성공 입력 처리 axios 호출
              this.setThresholdData(saveEquipNum,todCaution,todWarning,num);
            }
          }
        //주의 값을 입력하지 않았을때
        } else {
          //경고 값은 입력했을 때
          if(todWarning != ''){
            if(this.threshCautionValue == '사용 안함'){
              //값 성공 입력 처리 axios 호출
              this.setThresholdData(saveEquipNum,todCaution,todWarning,num);
            //입력한 경고값이 주의값보다 작으면
            }else if(parseInt(this.threshCautionValue) >= parseInt(todWarning)){
              alert('입력하신 경고 값은 주의 값보다 높아야 합니다.')
              //input value 초기화
              this.initInputData();
              return;
            } else {
              //값 성공 입력 처리 axios 호출
              this.setThresholdData(saveEquipNum,todCaution,todWarning,num);
            }
          } else {
            alert('선택하신 장비의 주의 또는 경고값을 입력하셔야 합니다.')
            return;
          }
        }
      }
    },
    setThresholdData(saveEquipNum,todCaution,todWarning,num){
      axios({
        url: "/equipment/setThresholdData",
        method: "GET",
        params: {
          saveEquipNum,
          todCaution,
          todWarning
        }
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          //저장하기 - 팝업 종료(새로고침)
          if(num == 1){
            alert(this.equipmentName + ' 장비 설정이 저장 되었습니다. 팝업창을 닫습니다.');
            router.go();
          }else{
            alert(this.equipmentName + ' 장비 설정이 적용 되었습니다.');
            this.threshWarningValue = todWarning;
            this.threshCautionValue = todCaution;
            this.initInputData();
          }
        }
      })
    },
/*    enableThreshValue() {
      let enableEquipNum = this.equipSettingNum;
      if (enableEquipNum == 0) {
        alert('장비를 선택하셔야 합니다.');
        return;
      } else {
        alert(this.equipmentName + ' 장비 설정이 적용 되었습니다.');
      }
    },*/
    initInputData(){
      $('#TODCaution').val('');
      $('#TODWarning').val('');
    },
    resetRow(num) {
      $('#equipment_' + num).val(null)
    },
    equipChange(num,orginName){
      let equipment_data = $('#equipment_' + num).val();
      if(equipment_data != ''){
        if(equipment_data == orginName){
          alert('기존과 같은 장비 이름입니다. 변경하실 장비 명을 다시 입력해주세요.')
        }else{
          axios({
            url: "/equipment/setChangeEquipName",
            method: "GET",
            params: {
              num,
              equipment_data
            }
          }).then(({data, status}) => {
            if (status === 304) {
              alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
            } else {
              alert("장비 이름이 수정 되었습니다.")
              $('#equipment_' + num).val(null)
              this.getEquipmentList();
            }
          })
        }
      } else {
        alert('변경하실 장비명을 입력하셔야 합니다.')
      }
    },
    equipDelete(num,data){
      if(confirm(data + ' 해당 장비를 삭제 하시겠습니까?\n 삭제한 장비는 복구하실수 없습니다.')){
        axios({
          url: "/equipment/deleteEquipment",
          method: "GET",
          params: {
            num
          }
        }).then(({data, status}) => {
          if (status === 304) {
            alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
          } else {
            alert("장비가 삭제되었습니다..")
            this.getEquipmentList();
          }
        })
      }
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
