const {socketServer} = require("./socketServer");
const fs = require('fs');

exports.inputDataJson = (averageDataJson) => {
    /*
       1. 데이터를 json로 형태 변환.
         1) 가장 최상위 층(layer) json은 장비 구분으로 정의한다.
         2) 두번째 층(layer) json은 시간으로 정의한다.
         3) 그리도 마지막으로 데이터 정의 부분으로 구현을 해서 총 3계층으로 설게 한다.

       2. 정의된 json 리스트를 1분 평균을 우선 순위로 계산을 하며, 이를 기준으로 5분, 10분, 1시간, 24시간(하루)에 대한 평균을 계산한다.
       3. 정의된 json 배열들을 순서대로 담기 위한 arrayList 생성한다. - 해당 데이터는 하루가 지나는 자정이 되면 log 파일(txt)로 서버 임의의 영역에 생성 한다.
       4. 먼저 1분 평균을 계산하기 위해서는 먼저 서버가 실행된 시간을 받아온다.(global 지정 변수 -> serverStartTime)
       5. 서버가 실행된 시간에 대한 기준으로 같은 분(minute)일 때 순서대로 push 처리된 arrayList
       6. 만약 다음으로 받아오는 분(minute)이 증가가 된다면, 반복문을 벗어나면서 평균을 계산한다.
     */
    let equipJson = new Object();
    let timeJson = new Object();
    let dataJson = new Object();
    let data;
    for (let i = 0; i < averageDataJson.length; i++) {
        if (i % 2 == 0) {
            if (averageDataJson[i] == 'absoluteId') {
                equipJson.absoluteId = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'time') {
                timeJson.time = averageDataJson[i + 1];
                data = averageDataJson[i + 1].replace(/:/g, "");
                console.log("data : ", data)
            } else if (averageDataJson[i] == 'TOD') {
                dataJson.sensor_signal_data_tod = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'SS1' || averageDataJson[i] == 'SS2') {
                dataJson.sensor_signal_data_mos = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'TH1' || averageDataJson[i] == 'TH2' || averageDataJson[i] == 'TH3') {
                dataJson.sensor_signal_data_h2s = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'TN1' || averageDataJson[i] == 'TN2' || averageDataJson[i] == 'TN3') {
                dataJson.sensor_signal_data_nh3 = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'TV1' || averageDataJson[i] == 'TV2' || averageDataJson[i] == 'TV3') {
                dataJson.sensor_signal_data_voc = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'OTT') {
                dataJson.sensor_signal_data_ott = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'OTH') {
                dataJson.sensor_signal_data_oth = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'OWD') {
                dataJson.sensor_signal_data_owd = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'OWS') {
                dataJson.sensor_signal_data_ows = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'ITT') {
                dataJson.sensor_signal_data_itt = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'BTV') {
                dataJson.sensor_signal_data_btv = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'VSD') {
                dataJson.sensor_signal_data_vsd = averageDataJson[i + 1];
            } else if (averageDataJson[i] == 'PSD') {
                dataJson.sensor_signal_data_psd = averageDataJson[i + 1];
            }
        }
        timeJson.dataTime = dataJson;
        equipJson.equipment = timeJson;
        JSON.stringify(equipJson);
    }
    arrayList.push(equipJson);
    //console.log("누적값 : ", JSON.stringify(arrayList))
    console.log("누적 데이터 : ", arrayList.length)

    //로그파일 생성
    fs.writeFile("../backend/log/log_" + data + ".txt", JSON.stringify(arrayList), function (err) {
        if (err) {
            console.log("로그 파일 생성 오류 : ", err);
        }
    });
}