<template>
  <div class="modal">
    <div class="overlay" @click="$emit('user-close')"></div>
    <div class="user-modal-card">
      <!--유저 상단 영역-->
      <div class="user-top-area">
        사용자 계정 관리
      </div>
      <!--유저 하단 영역-->
      <div class="user-center-area">
        <table class="user-table" id="userTable">
          <thead>
          <tr>
            <td>아이디</td>
            <td>이름</td>
            <td>비밀번호</td>
            <td>전화번호</td>
            <td>장비 할당</td>
            <td>가입일</td>
            <td>계정 활성화</td>
            <td>설정</td>
            <td>삭제</td>
          </tr>
          </thead>
          <tbody id="selectDatatable">
          </tbody>
        </table>
      </div>
      <div class="user-bottom-area">
        <button @click="$emit('user-close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "jquery/dist/jquery.min"
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.css"
import $ from 'jquery';

let datatableUserList;
export default {
  data: function () {
    return {
      userDatatable: [],
    }
  },
  mounted() {
    this.getUserInfor();
  },
  methods: {
    getUserInfor() {
      /*this.$store.dispatch("GETUSERINFOR", {})
        .then(success => {
          this.drawUserTable();
      })*/
      axios({
        url: "/user/getUserInfor",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          this.userDatatable = data.userInfor
          this.drawUserTable(this.userDatatable);
        }
      })
    },
    drawUserTable(data) {
      //데이터테이블 초기화
      if (typeof (datatableUserList) != 'undefined') {
        datatableUserList.clear();
        datatableUserList.destroy();
      } else {
        datatableUserList = $('#userTable').DataTable({
          pageLength: 10,
          order: [[1, 'asc']],
          // autoWidth: false,
          // autoHeight: false,
          language: {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Korean.json"
          },
          data: data,
          columns: [
            {
              render: function (data, type, row) {
                return '<input type="text" name="input_field" placeholder="' + row['MEMBER_ID'] + '">';
              }
            },
            {
              render: function (data, type, row) {
                return '<input type="text" name="input_field" placeholder="' + row['MEMBER_NAME'] + '">';
              }
            },
            {
              render: (data, type, row) => {
                return this.passwordSetting(row['MEMBER_SEQ']);
              },
            },
            {
              render: function (data, type, row) {
                return '<input type="text" name="input_field" placeholder="' + row['MEMBER_TEL'] + '">';
              }
            },
            {
              render: (data, type, row) => {
                return this.selectEquip(row['MEMBER_ID']);
              },
            },
            {data: 'MEMBER_REG_DATE'},
            {
              render: (data, type, row) => {
                return this.memberCk(row['MEMBER_CK']);
              },
            },
            {
              render: (data, type, row) => {
                return this.settingArea();
              },
            },
            {
              render: (data, type, row) => {
                return this.deleteArea();
              },
            },
          ]
        })
      }
    },
    passwordSetting(passSetting) {
      let passArea = '<input type="password" placeholder="비밀번호">';
      passArea += '<td><button>초기화</button></td>';
      return passArea;
    },
    selectEquip(equipNum) {
      let selectArea = '<select>\n' +
        '<option value="0">모든장비</option>\n' +
        '<option value="1">지코바</option>\n' +
        '<option value="2">KFC</option>\n' +
        '<option value="3">피자나라치킨공주</option>\n' +
        '<option value="4">BHC</option>\n' +
        '</select>'
      return selectArea;
    },
    settingArea() {
      let settingButton = '<button>변경</button>' +
        '<button>초기화</button>'
      return settingButton;
    },
    deleteArea() {
      let deleteArea = '<button>삭제</button>'
      return deleteArea;
    },
    memberCk(ckValue) {
      let ckButton = '';
      if (ckValue == 1) {
        ckButton += '<button class="Active">활성화</button>'
      } else {
        ckButton += '<button class="nonActive">비활성화</button>'
      }
      return ckButton;
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/userModal";
</style>
