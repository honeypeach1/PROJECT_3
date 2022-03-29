import Vue from 'vue';
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

import userStore from "./modules/user/userStore";
import equipmentStore from "./modules/equipment/equipmentStore";

const store = new Vuex.Store({
  modules: {
    userStore: userStore,
    equipmentStore: equipmentStore,
  },
  /*
   vuex store의 state에 저장된 값을 웹 브라우저의 localStorage에 저장 및 업데이트를 해줌.
   즉 화면이 새로 고침(로딩)이 되어도 없어지지 않음. localStorage에 있는 값을 state에 다시 동기화 실시
  */
  plugins: [createPersistedState({
    paths: ["userStore"]
  })]
})

export default store
