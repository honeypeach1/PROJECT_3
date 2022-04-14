import axios from "axios";

//장비 모듈
export default {
  state: {
    isRegist: false
  },
  getters: {},
  actions: {
    REGISTEQUIPMENT({commit}, {
      equipment_name, equipment_type, equipment_lat, equipment_lng,
      equipment_address, equipment_company, equipment_port
    }) {
      return axios({
        url: "/static/registequip",
        method: "POST",
        data: {
          equipment_name, equipment_type, equipment_lat, equipment_lng,
          equipment_address, equipment_company, equipment_port
        }
      }).then(({data, status}) => {
        if (status === 304) {
          alert('페이지 에러가 발생하였습니다. 관리자에게 문의하세요.');
        } else {
          if(data.success){
            alert(data.message);
            commit("REGPROCESS",true);
          }else{
            alert(data.message);
            commit("REGPROCESS",false);
          }
        }
      })
    }
  },
  mutations: {
    REGPROCESS(state, data) {
      state.isRegist = data;
    }
  }
}


