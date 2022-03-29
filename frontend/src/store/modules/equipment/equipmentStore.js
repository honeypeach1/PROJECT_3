/*
  store 구조 패턴을 정의하는 Vuex의 메인 파일
*/
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/*
 vuex의 흐름도
 요청 -> dispatch -> Actions(commit) -> Mutations(State) -> State -> Getters -> Vue Components
*/
export default new Vuex.Store({
  /*
    mutation(조작)에서 마지막으로 호출되는 userState(저장) 객체
    vuex 구조
    1. userState 객체
    공통 참조 변수 정의
    프로젝트 모든 곳에서 이름 참조 사용 가능
    모든 컴포넌트들의 공통된 값을 사용 가능
  */
  state: {

  },
  /*
    actions에서 그다음에 호출되는 조작(mutation) 객체
    userState 변경을 담당한다.
    반드시 mutation을 통해서만 state를 변경해야 햠.
    동기 처리
    commit방식으로 호출
  */
  mutations: {

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

  },
  /*
   Vue 컴포넌트에서 Computed로 정의
  */
  getters: {

  }
})
