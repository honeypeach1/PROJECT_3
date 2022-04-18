export const lineChart = {
  data: [
    {
      name: 'TOD',
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
    },
    {
      name: 'MOS',
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
    },
  ],
  layout: {
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    autosize: true,
    height: 300,
    margin: {
      t: 20,
      b: 20,
      l: 20,
      r: 10,
    },
    showlegend: true,
    legend: {
      "orientation": "h",
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
  config: {
    responsive: true,
  },
};

export default lineChart;
