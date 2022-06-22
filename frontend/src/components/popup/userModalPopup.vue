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
            <td>권한</td>
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
      userNum: '',
    }
  },
  mounted() {
    this.getUserInfor();
  },
  methods: {
    getUserInfor() {
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
    userSettingActivate(userSeq,userCk) {
      console.log("유저 번호 : ", userSeq,userCk)
    },
    drawUserTable(data) {
      //데이터테이블 초기화
      if (typeof (datatableUserList) != 'undefined') {
        datatableUserList.clear();
        datatableUserList.destroy();
      }

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
          {data: 'MEMBER_ID'},
          {
            render: (data, type, row) => {
              return '<input type="text" class="changeUserName" name="input_field" placeholder="' + row['MEMBER_NAME'] + '">';
            }
          },
          {
            render: (data, type, row) => {
              return '<form><input type="password" autocomplete="on" class="changeUserPass" placeholder="비밀번호"><button class="changePassButton" value="' + row['MEMBER_SEQ'] + '">변경</button></form>';
            }
          },
          {
            render: function (data, type, row) {
              return '<input type="text" class="changeUserTel" name="input_field" placeholder="' + row['MEMBER_TEL'] + '">';
            }
          },
          {
            render: function (data, type, row) {
              return '<select class="changeUserEquip"><option value="0">모든장비</option><option value="1">지코바</option><option value="2">KFC</option><option value="3">피자나라치킨공주</option><option value="4">BHC</option></select>';
            }
          },
          {data: 'MEMBER_REG_DATE'},
          {
            render: function (data, type, row) {
              return '<select class="changeUserReles"><option v-if="' + (row['MEMBER_RELES'] == 0 ? 'selected' : '') + '" value="0">관리자</option><option v-if="' + (row['MEMBER_RELES'] == 1 ? 'selected' : '') + '" value="1">일반유저</option>';
            }
          },
          {
            render: (data, type, row) => {
              let className;
              let activateValue;
              if (row['MEMBER_CK'] == 1) {
                className = 'on';
                activateValue = '활성화';
              } else {
                className = 'off';
                activateValue = '비활성화';
              }
              return '<button class="changeUserActive ' + className + '" @click="userSettingActivate(' + row['MEMBER_SEQ'] + ',' + row['MEMBER_CK'] + ')">' + activateValue + '</button>';
            },
          },
          {
            render: (data, type, row) => {
              return '<button class="changeUserInfor" value="' + row['MEMBER_SEQ'] + '">변경</button><button class="changeUserReset">초기화</button>';
            }
          },
          {
            render: (data, type, row) => {
              return '<button class="deleteUserInfor" value="' + row['MEMBER_SEQ'] + '">삭제</button>';
            }
          },
        ]
      });
        $('#userTable tbody').on('click', 'button', (e) => {
          let ch = e.target.className;
          let member_seq = e.target.value;
          let data = datatableUserList.row($(this));
          alert("ch : " + ch)
          console.log("data : " + data)
          alert("data : " + data)
          alert("member_seq : " + member_seq)
          if (ch == 'changePassButton') {

          } else if (ch == 'changeUserActive on' || ch == 'changeUserActive off') {

          } else if (ch == 'changeUserInfor') {

          } else if (ch == 'changeUserReset') {

          } else if (ch == 'deleteUserInfor') {

          }

          /*axios({
            url:"/user/setUserPass",
            method: "POST",
            params: {

              member_seq
            }
          }).then((res) => {
            if (res.data.success) {

            } else {

            }
          }).catch((err) => {
            console.log(error)
          })*/
        })
    },
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/userModal";
</style>
