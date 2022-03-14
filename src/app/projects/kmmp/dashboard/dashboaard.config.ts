export const Status = {
  EXECUTED: "Ejecutado",
  NO_EXECUTED: "No ejecutado",
  POSTPONED: "Postergado",
};

export const pieViewData = {
  series: [0, 0],
  labels: ["Ejecutadas", "No ejecutadas"],
  position: "bottom",
  responsive: {
    breakpoint: 480,
    options: {
      chart: {
        type: null,
        height: 0,
        width: 200,
        stacked: false,
      },
      legend: {
        position: "bottom",
        horizontalAlign: null,
        offsetX: 0,
      },
    },
  },
  chart: {
    type: "donut",
    height: 350,
    width: 450,
    stacked: false,
  },
};

export const pieChartViewData = {
  colors: ["#1e61cb", "#8ac8db", "#8ac8db"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [10, 10, 10],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 450,
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: null,
      endingShape: null,
    },
  },
  dataLabels: {
    enable: false,
  },
  xaxis: {
    categories: ["Ejecutada", "No ejecutada", "Postergada"],
    convertedCatToNumeric: false,
  },
};

export const BasiBarChart = {
  colors: ["red", "black"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [0, 0, 0],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 450,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      colors: {
        backgroundBarColors: [],
        ranges: [],
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Ejecutado", "No ejecutado", "Postergado"],
  },
};

export const Postponed: any = {
  colors: ["red", "black"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [400, 300, 220, 65, 400, 300, 220, 65],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 450,
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: null,
      endingShape: null,
      colors: {
        backgroundBarColors: [],
        ranges: [],
      },
    },
  },
  dataLabels: {
    enable: false,
  },
  xaxis: {
    categories: [
      "Preventivo",
      "Backlog",
      "Camb Comp",
      "Inspección",
      "Lavado",
      "Observaciones",
      "Predictivo",
      "Pre-PM",
    ],
  },
};

export const CausesChart = {
  colors: ["red", "black"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 450,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [],
  },
};

export const ColorRangesPlotOptions = [
  { from: 0, to: 10, color: "#00A7FF" },
  { from: 10, to: 50, color: "#140A9A" },
  { from: 51, to: 100, color: "#CBF266" },
  { from: 101, to: 2000, color: "#140A9A" },
];
