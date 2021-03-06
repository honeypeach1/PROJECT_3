import axios from "axios";
import VueCookies from "vue-cookies";

export default {
//유저 모듈
  //user: JSON.parse(localStorage.getItem('')),
  /*
   mutation(조작)에서 마지막으로 호출되는 userState(저장) 객체
   vuex 구조
   1. userState 객체
   공통 참조 변수 정의
   프로젝트 모든 곳에서 이름 참조 사용 가능
   모든 컴포넌트들의 공통된 값을 사용 가능
 */
  state: {
    token: null,
    user_info: null,
    isLogin: false,
  },

  /*
 Vue 컴포넌트에서 Computed로 정의
*/
  getters: {
    //로그인 확인 로직
    loggedIn(state) {
      return !!state.isLogin;
    }
  },

  /*
  vue component에서 처음 호출되는 싱글톤 store 객체
  mutation을 실행시켜주는 역할 담당
  비동기 처리 기준(서버 데이터 호출)
  dispacth(함수명, 전달인자) 방식으로 호출
  userActions 내에 함수들을 작성
  비동기 기준이므로 주로 콜백 함수로 작성
  action에서 첫번째 인자를 context 인자로 받을 수 있으며, userState, commit, dispatch, rootstate 포함
  두번째 인자는 mutation과 동일하게 payload로 받을 수 있음.
*/
  actions: {
    LOGIN({commit}, {login_id, login_pass}) {
      return axios({
        url: "/user/loginCheck",
        method: "POST",
        data: {login_id, login_pass}
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          if (data.success) {
            commit("LOGIN_PROCESS", data);
          } else {
            alert(data.message);
            commit("LOGIN_PROCESS", null);
          }
        }
      })
    },
    REGISTER({commit}, {register_id, register_pwd, register_name, register_tel, register_role}) {
      axios({
        url: "/user/registerUser",
        method: "POST",
        data: {register_id, register_pwd, register_name, register_tel, register_role}
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          if (data.success) {
            alert(data.message);
          } else {
            alert(data.message);
          }
        }
      })
    },
    /*유저 정보 가져오기*/
    /*GETUSERINFOR({commit}) {
      axios({
        url: "/user/getUserInfor",
        method: "GET",
      }).then(({data, status}) => {
        if (status === 304) {
          alert("페이지 에러가 발생하였습니다. 관리자에게 문의하세요.")
        } else {
          commit("USER_INFOR_PROCESS", data.userInfor)
        }
      })
    },*/
    /*세션 초기화를 위해서 백엔드 접근이 필요함.*/
    LOGOUT({commit}) {
      axios({
        url: "/user/logout",
        method: "POST",
      }).then((res) => {
        //alert(res.data.message);
        commit("LOGOUT_PROCESS")
      })
    }
  },

  /*
  actions에서 그다음에 호출되는 조작(mutation) 객체
  userState 변경을 담당한다.
  반드시 mutation을 통해서만 state를 변경해야 햠.
  동기 처리
  commit방식으로 호출
*/
  mutations: {
    //세션 또는 쿠키 정보를 가져오면 됨. 가져와서 state에서 정의한 변수에 대입하여 필요시 가져와서 사용
    LOGIN_PROCESS(state, data) {
      state.token = data.token;
      state.user_info = data.user_info;
      state.isLogin = true;
    },
    /*USER_INFOR_PROCESS(state, res) {
      state.getUserInfor = res;
    },*/
    LOGOUT_PROCESS(state) {
      localStorage.removeItem('vuex');
      //reload() -> vuex store, axios header 클리어
      location.reload();
      axios.defaults.headers.common['Authorization'] = null;

      state.token = null;
      state.user_info = null;
      state.isLogin = false;
    }
  }
}

