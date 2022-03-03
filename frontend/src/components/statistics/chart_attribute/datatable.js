export const datatable = {
  data: {
    columns: [
      {"data": "DataDateTime", "className": "dt-head-center dt-body-center timeClass", "orderable": false},
      {"data": "TOD", "className": "dt-head-center dt-body-center badClass", "orderable": false},
      {"render": "todValue", "className": "dt-head-center dt-body-center badClass ", "orderable": false},
      {"data": "H2S", "className": "dt-head-center dt-body-center badClass", "orderable": false},
      {"data": "NH3", "className": "dt-head-center dt-body-center badClass", "orderable": false},
      {"data": "VOC", "className": "dt-head-center dt-body-center badClass", "orderable": false},
      {"data": "MOS", "className": "dt-head-center dt-body-center badClass", "orderable": false},
      {"data": "OWD", "className": "dt-head-center dt-body-center weatherClass", "orderable": false},
      {"data": "OWS", "className": "dt-head-center dt-body-center weatherClass", "orderable": false},
      {"data": "OTT", "className": "dt-head-center dt-body-center weatherClass", "orderable": false},
      {"data": "OTH", "className": "dt-head-center dt- body-center weatherClass", "orderable": false},
      {"data": "ATM", "className": "dt-head-center dt- body-center weatherClass", "orderable": false},
    ],
    rows: [
      {
        DataDateTime: "2022-01-31 12:31:22",
        TOD: "13",
        todValue: "주의",
        H2S: "11",
        NH3: "12",
        VOC: "13",
        MOS: "14",
        OWD: "북서",
        OWS: "0.5",
        OTT: "22.4",
        OTH: "15",
        ATM: "998"
      },
      {
        DataDateTime: "2022-01-31 12:31:22",
        TOD: "13",
        todValue: "주의",
        H2S: "11",
        NH3: "12",
        VOC: "13",
        MOS: "14",
        OWD: "북서",
        OWS: "0.5",
        OTT: "22.4",
        OTH: "15",
        ATM: "998"
      },
      {
        DataDateTime: "2022-01-31 12:31:22",
        TOD: "13",
        todValue: "주의",
        H2S: "11",
        NH3: "12",
        VOC: "13",
        MOS: "14",
        OWD: "북서",
        OWS: "0.5",
        OTT: "22.4",
        OTH: "15",
        ATM: "998"
      },
    ]
  }
}

export default datatable;