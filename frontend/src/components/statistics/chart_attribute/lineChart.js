export const lineChart = {
  data: [
    {
      mode: 'markers+lines',
      name: 'OECD',
      type: 'scatter',
      x: [1870, 1880, 1890, 1900, 1913, 1929, 1938, 1950, 1960, 1970, 1980, 1990, 2000, 2007],
      y: [0.175, 0.192, 0.22, 0.24600000000000002, 0.27699999999999997, 0.33399999999999996, 0.366, 0.41700000000000004, 0.48200000000000004, 0.541, 0.593, 0.6579999999999999, 0.745, 0.809],
    },
    {
      mode: 'markers+lines',
      name: 'Central & Eastern Europe (incl. Russia)',
      type: 'scatter',
      x: [1870, 1880, 1890, 1900, 1913, 1929, 1938, 1950, 1960, 1970, 1980, 1990, 2000, 2007],
      y: [0.073, 0.08199999999999999, 0.09699999999999999, 0.11900000000000001, 0.133, 0.187, 0.266, 0.335, 0.413, 0.48200000000000004, 0.49, 0.509, 0.49700000000000005, 0.537],

    },
    {
      mode: 'markers+lines',
      name: 'Latin America',
      type: 'scatter',
      x: [1870, 1880, 1890, 1900, 1913, 1929, 1938, 1950, 1960, 1970, 1980, 1990, 2000, 2007],
      y: [0.055, 0.06, 0.071, 0.083, 0.106, 0.13699999999999998, 0.156, 0.215, 0.263, 0.313, 0.374, 0.40299999999999997, 0.48100000000000004, 0.52],
    },
  ],
  layout: {
    autosize: true,
    height: 300,
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    showlegend : true,
    title: {
      text :'대기 환경 지수(ppb)',
      font: {
        color: '#fff',
        family: "NanumSquare",
      }
    },
    xaxis: {
      visible : true,
      // dtick : 1,
      gridcolor: '#585858',
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      color : "#fff",
      ticks : "outside",
      showgrid : true,
    },
    yaxis: {
      title : {
        display : true,
        text : 'ppb',
        font : {
          size: 14,
          color: '#fff'
        }
      },
      gridcolor: '#585858',
      tickfont: {
        family: 'Arial',
        size: 12,
        color: '#fff'
      },
      color : "#fff",
      ticks : "outside",
      showgrid : true,
      rangemode: 'normal',
      fixedrange: true
    },
/*    legend: {
      font: {
        color: '#fff'
      },
      x: 1,
      xanchor: 'right',
      y: 1
    },*/
    legend: {
      "orientation": "h"
    },
  },
  config: {
    responsive: true,
  },
};

export default lineChart;
