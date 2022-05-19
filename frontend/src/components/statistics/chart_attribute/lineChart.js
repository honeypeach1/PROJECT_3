export const lineChart = {
  chartDraw: (lineData) => {
    const time = [];
    const h2s = [];
    const nh3 = [];
    const mos = [];
    const tod = [];
    const voc = [];
    //호출때 마다 초기화
    for (let sensorData in lineData) {
      console.log("lineData[sensorData] : ",lineData[sensorData])
      time.push(lineData[sensorData].DataDateTime);
      h2s.push(lineData[sensorData].H2S);
      nh3.push(lineData[sensorData].MOS);
      mos.push(lineData[sensorData].NH3);
      tod.push(lineData[sensorData].TOD);
      voc.push(lineData[sensorData].VOC);
    }
    const data = [];
    data.push({
      name: 'TOD',
      mode: 'lines+markers',
      type: 'scatter',
      x: time,
      y: tod,
    })

    data.push({
      name: 'MOS',
      mode: 'lines+markers',
      type: 'scatter',
      x: time,
      y: mos,
    })

    data.push({
      name:  'H<sub>2</sub>S',
      mode: 'lines+markers',
      type: 'scatter',
      x: time,
      y: h2s,
    })

    data.push({
      name: 'NH<sub>3</sub>',
      mode: 'lines+markers',
      type: 'scatter',
      x: time,
      y: nh3,
    })

    data.push({
      name: 'VOC',
      mode: 'lines+markers',
      type: 'scatter',
      x: time,
      y: voc,
    })
    return data;
  },
  layout: {
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    autosize: true,
    Height: 264,
    margin: {
      t: 30,
      b: 30,
      l: 30,
      r: 20,
    },
    showlegend: true,
    legend: {
      trace_groupgap: 5,
      orientation: "h",
      valign: 'middle',
      font: {
        color: "#d9dfea",
        size: 9,
      },
      tracegroupgap: 1,
      itemsizing: 'constant'
    },
    xaxis: {
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      nticks: 5,
      showgrid: false,
    },
    yaxis: {
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      gridcolor: 'rgba(231,231,231,0.3)',
      showgrid: true,
      rangemode: 'normal',
      fixedrange: false
    },
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
  },
};

export default lineChart;
