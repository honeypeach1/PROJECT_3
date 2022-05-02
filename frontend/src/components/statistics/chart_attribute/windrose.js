const thetas = ["북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동", "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서"];
const color = ['#ffffff','#0000ff', '#00cd00', '#00ff00', '#f07b7b'];
const speedCrteria = [0.5, 5, 8, 11, 999999];
const speedName = ['', '0.5 ~ 5.0', '5.0 ~ 8.0', '8.0 ~ 11', '11 ~'];

//방향마다 집계
const eachDirectionCount = [];
//2차원 배열로 속도별 방향별 데이터가 몇개인지 저장
const eachSpeedEachDirectionCount = [];
//2차원 배열 속도별, 방향별 데이터 갯수 누적 값
const eachSpeedEachDirectionCountSum = [];
//방향마다 데이터가 몇개 있는지 비중을 저장
const eachDirectionCountPercent = [];
//2차원 배열로 속도마다, 방향마다 데이터가 몇개 있는지 비중
const eachSpeedEachDirectionCountPecent = [];
const eachSpeedEachDirectionCountPecentbyTotal = [];
//2차원 배열 속도별, 방향별, 데이터 갯수 누적 값의 비중
const eachSpeedEachDirectionCountSumPecent = [];
const eachSpeedEachDirectionCountSumPecentbyTotal = [];
const data = [];

function getWindTableData(color, direction, dirSize, spdSize, percentData) {
  data.color = color;
  data.direction = direction;
  data.dirSize = dirSize;
  data.spdSize = spdSize;
  data.percentData = percentData;
  return data;
}

export const windRose = {
  windRoseDraw: (winData) => {
    const windSize = winData.length;

    //배열 초기화
    for (const spdIndex in speedCrteria) {
      eachSpeedEachDirectionCount[spdIndex] = [];
      eachSpeedEachDirectionCountSum[spdIndex] = [];
      eachSpeedEachDirectionCountPecent[spdIndex] = [];
      eachSpeedEachDirectionCountPecentbyTotal[spdIndex] = [];
      eachSpeedEachDirectionCountSumPecent[spdIndex] = [];
      eachSpeedEachDirectionCountSumPecentbyTotal[spdIndex] = [];
      for (const dirIndex in thetas) {
        //1차원 배열
        eachDirectionCount[dirIndex] = 0;
        eachDirectionCountPercent[dirIndex] = 0;
        //2차원 배열
        eachSpeedEachDirectionCount[spdIndex][dirIndex] = 0;
        eachSpeedEachDirectionCountSum[spdIndex][dirIndex] = 0;
        eachSpeedEachDirectionCountPecent[spdIndex][dirIndex] = 0;
        eachSpeedEachDirectionCountPecentbyTotal[spdIndex][dirIndex] = 0;
        eachSpeedEachDirectionCountSumPecent[spdIndex][dirIndex] = 0;
        eachSpeedEachDirectionCountSumPecentbyTotal[spdIndex][dirIndex] = 0;
      }
    }

    //받은 풍배 관련 데이터를 카운트
    for (const row of winData) {
      eachDirectionCount[row.OWD] += 1;
      for (let spdIndex = 0; spdIndex < speedCrteria.length; spdIndex++) {
        const speed = speedCrteria[spdIndex];
        if (row.OWS < speed) {
          eachSpeedEachDirectionCount[spdIndex][row.OWD] += 1;
          break;
        }
      }
    }

    //누적값 - 그래프
    for (let dirIndex = 0; dirIndex < thetas.length; dirIndex++) {
      for (let spdIndex = 0; spdIndex < speedCrteria.length; spdIndex++) {
        if (spdIndex === 0) {
          eachSpeedEachDirectionCountSum[spdIndex][dirIndex] = 0;
          continue;
        }
        const lastCount = eachSpeedEachDirectionCountSum[spdIndex - 1][dirIndex];
        eachSpeedEachDirectionCountSum[spdIndex][dirIndex] = eachSpeedEachDirectionCount[spdIndex][dirIndex] + lastCount;
      }
    }

    //값이 존재하지 않는 데이터를 그래프에 표시할 필요가 없으므로 필터링
    for (let spdIndex = 2; spdIndex < speedCrteria.length; spdIndex++) {
      for (let dirIndex = 0; dirIndex < thetas.length; dirIndex++) {
        const lastValue = eachSpeedEachDirectionCountSum[spdIndex - 1][dirIndex];
        const currentValue = eachSpeedEachDirectionCountSum[spdIndex][dirIndex];

        if (lastValue === currentValue || lastValue === 0) {
          eachSpeedEachDirectionCountSum[spdIndex][dirIndex] = 0;
        }
      }
    }

    //각 방향의 비중 계산
    for (let dirIndex = 0; dirIndex < thetas.length; dirIndex++) {
      eachDirectionCountPercent[dirIndex] = (eachDirectionCount[dirIndex] * 100 / winData.length);
    }

    //각 속도에 대해서 각 방향의 비중을 계산
    for (let spdIndex = 0; spdIndex < speedCrteria.length; spdIndex++) {
      for (let dirIndex = 0; dirIndex < thetas.length; dirIndex++) {
        const directionCount = eachDirectionCount[dirIndex];

        eachSpeedEachDirectionCountPecent[spdIndex][dirIndex] = (eachSpeedEachDirectionCount[spdIndex][dirIndex] * 100 / directionCount);
        eachSpeedEachDirectionCountPecentbyTotal[spdIndex][dirIndex] = (eachSpeedEachDirectionCount[spdIndex][dirIndex] * 100 / winData.length);

        eachSpeedEachDirectionCountSumPecent[spdIndex][dirIndex] = (eachSpeedEachDirectionCountSum[spdIndex][dirIndex] * 100 / directionCount);
        eachSpeedEachDirectionCountSumPecentbyTotal[spdIndex][dirIndex] = (eachSpeedEachDirectionCountSum[spdIndex][dirIndex] * 100 / winData.length);
      }
    }

    const data = [];
    for (let i = 0; i < speedCrteria.length - 1; i++) {
      const index = speedCrteria.length - 1 - i;
      data.push({
        r: eachSpeedEachDirectionCountSumPecentbyTotal[index],
        text: eachSpeedEachDirectionCountPecentbyTotal[index],
        theta: thetas,
        name: speedName[index],
        marker: {color: color[index]},
        width: 0.4,
        hoverinfo: 'text',
        hovertemplate: '%{text: .2f}%',
        type: "barpolar"
      })
    }
    return data;
  },
  layout: {
    plot_bgcolor: '#042238',
    paper_bgcolor: 'transparent',
    width: 350,
    height: 300,
    margin: {
      t: 50,
      b: 40,
      l: 50,
      r: 45,
    },
    font: {
      size: 13,
      color: "#000",
      weight: "bold",
    },
    polar: {
      barmode: "overlay",
      bargap: 0,
      radialaxis: {
        ticksuffix: "%",
        angle: 0,
        dtick: 1,
        nticks: 6,
        tickmode: 'auto',
        tickangle: 90,
        tickfont: {size: 12}
      },
      angularaxis: {
        direction: "clockwise",
        size: 13,
        color: "#d9dfea",
      },
    },
    modebar: {
      orientation: 'v'
    },
    showlegend: false,
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
  },
  getWindTableCallFunction() {
    /*
      풍배도 테이블에 표현하기 위한 function 호출
    - 전달 파라미터
      1. color 풍속별 색상표
      2. direction 풍향
      3. dirSize 방향 개수
      4. spdSize 풍속 개수
      5. percentage 방향별 풍속 빈도 데이터
    */
    return getWindTableData(color,thetas,thetas.length,speedCrteria.length,eachSpeedEachDirectionCountPecentbyTotal);
  }
}

export default windRose;
