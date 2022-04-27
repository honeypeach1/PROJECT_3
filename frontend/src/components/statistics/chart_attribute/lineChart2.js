let time = [], h2s = [], nh3 = [], mos = [], tod = [], voc = [];
export const lineChart = {
  chartDraw: (data) => {
    for (let sensorData in data){
      time.push(data[sensorData].DATA_DATE_TIME);
      h2s.push(data[sensorData].H2S);
      nh3.push(data[sensorData].MOS);
      mos.push(data[sensorData].NH3);
      tod.push(data[sensorData].TOD);
      voc.push(data[sensorData].VOC);
    }
  },
  data: [
    {
      name: 'TOD',
      type: 'scatter',
      x: time,
      y: tod,
    },
    {
      name: 'MOS',
      type: 'scatter',
      x: time,
      y: mos,
    },
    {
      name: 'NH<sub>3</sub>',
      type: 'scatter',
      x: time,
      y: nh3,
    },
    {
      name: 'H<sub>2</sub>S',
      type: 'scatter',
      x: time,
      y: h2s,
    },
    {
      name: 'VOC',
      type: 'scatter',
      x: time,
      y: voc,
    },
  ],
  layout: {
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    autosize: true,
    maxHeight: 300,
    margin: {
      t: 20,
      b: 20,
      l: 20,
      r: 10,
    },
    showlegend: true,
    legend: {
      "orientation": "h",
      xanchor: 'top',
      font: {
        color: "white"
      },
    },
    xaxis: {
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      tickformat: ',.60%',
      showgrid : false,
    },
    yaxis: {
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      showgrid: true,
      rangemode: 'normal',
      fixedrange: true
    },
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
  },
};

export default lineChart;
