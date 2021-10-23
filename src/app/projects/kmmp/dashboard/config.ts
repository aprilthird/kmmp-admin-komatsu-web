import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
} from "ng-apexcharts";

export type GroupBarChartOptions = {
  series: ApexAxisChartSeries;
  //chart: ApexChart;
  chart: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  color?: string[];
};

export type SimplePieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: any;
  responsive: ApexResponsive[];
  labels: any;
};

export type BasicBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors?: string[];
  fill?: any;
};

export type StackedBarChartOptions = {
  series: any; //ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: any; //ApexLegend;
};

export const AllStatusXFlota = {
  colors: ["#E91E63", "#FF9800"],
  series: [
    {
      name: "Ejecutado",
      data: [44, 55, 57, 56],
    },
    {
      name: "No ejecutado",
      data: [76, 85, 101, 98],
    },
    {
      name: "Postergado",
      data: [35, 41, 36, 26],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Auxiliar", "Camiones", "Palas", "Cargadores WA800"],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
};

export const SingleStatusXFlota = {
  series: [44, 55],
  chart: {
    type: "donut",
    width: 450,
    height: 350,
  },
  labels: ["Ejecutado", "No ejecutado"],
  position: "bottom",
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

export const BasiBarChart = {
  colors: ["red", "black"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [400, 300, 220, 65],
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
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Validada", "Observada", "En progreso", "Sin empezar"],
  },
};

export const NoCompletedActvBarChart = {
  series: [
    {
      name: "Preventivo",
      data: [44, 55],
    },
    {
      name: "Backlog",
      data: [53, 32],
    },
    {
      name: "Camb Comp",
      data: [12, 17],
    },
    {
      name: "Inspección",
      data: [9, 7],
    },
    {
      name: "Lavado",
      data: [25, 10],
    },
    {
      name: "Observaciones",
      data: [14, 7],
    },
    {
      name: "Preventivo",
      data: [25, 15],
    },
    {
      name: "Pre-PM",
      data: [35, 12],
    },
  ],
  chart: {
    type: "bar",
    height: 350,

    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  title: {
    text: "Fiction Books Sales",
  },
  xaxis: {
    categories: ["Postergados", "No ejecutados"],
    labels: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    offsetX: 40,
  },
};

export const BasiBarChartNoExec = {
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
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: false,
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

export const BasiBarChartNoExecCausas = {
  colors: ["red", "black"],
  fill: {
    colors: ["red", "black"],
  },
  series: [
    {
      name: "basic",
      data: [400, 300, 220, 65, 400],
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
    categories: [
      "Priorizar posición de servicio",
      "Priorizar por falla ó condicion de equipo",
      "Falta de recursos Komatsu",
      "Falta de recursos cliente",
      "Priorización de producción",
    ],
  },
};

export const DelayedCode = {
  series: [
    {
      name: "Demora en ejecución de PM",
      data: [44],
    },
    {
      name: "Demora en ejecución de PM",
      data: [53],
    },
    {
      name: "Demora por traslado de equipo",
      data: [12],
    },
    {
      name: "Falta de grúa",
      data: [9],
    },
    {
      name: "Activación de sistema contra incendio",
      data: [25],
    },
    {
      name: "Falta de insumos",
      data: [14],
    },
    {
      name: "Neumáticos",
      data: [25],
    },
    {
      name: "Sistema Dispatch",
      data: [35],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 950,

    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  title: {
    text: "Fiction Books Sales",
  },
  xaxis: {
    categories: ["Detalle de falla"],
    labels: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    offsetX: 40,
  },
};
