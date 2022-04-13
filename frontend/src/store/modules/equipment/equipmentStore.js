import axios from "axios";

//장비 모듈
export default {
  state: {},
  getters: {},
  actions: {
    REGISTEQUIPMENT({commit}, {
      equipment_name, equipment_type, equipment_lat, equipment_lng,
      equipment_address, equipment_company, equipment_port
    }) {
      return axios({
        url: "/static/registequip",
        method: "POST",
        data: {equipment_name, equipment_type, equipment_lat, equipment_lng,
          equipment_address, equipment_company, equipment_port}
      }).then(({data, status}) => {

      })
    }
  },
  mutations: {}
}


