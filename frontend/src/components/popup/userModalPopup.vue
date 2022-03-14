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
        <table class="user-table">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>admin</td>
              <td>
                <input type="text" placeholder="jamey">
              </td>
              <td>
                <input type="text"placeholder="변경하기">
                <button>초기화</button>
              </td>
              <td>
                <input type="text" placeholder="01026611538">
              </td>
              <td>
                <select>
                  <option value="0">모든장비</option>
                  <option value="1">지코바</option>
                  <option value="2">KFC</option>
                  <option value="3">피자나라치킨공주</option>
                  <option value="4">BHC</option>
                </select>
              </td>
              <td>
                2022.03.05
              </td>
              <td>
                <button>활성화</button>
              </td>
              <td>
                <button>변경</button>
                <button>초기화</button>
              </td>
            </tr>
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
export default {
  data: function () {
    return {}
  }
}
</script>

<style lang="scss">
@import "../../assets/style/popup/userModal";
</style>
