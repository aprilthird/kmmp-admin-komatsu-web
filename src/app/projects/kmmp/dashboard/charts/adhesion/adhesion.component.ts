import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";
//import { DxChartModule } from "devextreme-angular";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-adhesion",
  templateUrl: "./adhesion.component.html",
  styleUrls: ["./adhesion.component.scss"],
})
export class AdhesionComponent implements OnInit {
  //dataSource: ComplaintsWithPercent[] = this.getComplaintsData();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Income",
          type: "column",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        },
        {
          name: "Cashflow",
          type: "column",
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
        },
        {
          name: "Revenue",
          type: "line",
          data: [20, 29, 37, 36, 44, 45, 50, 58],
        },
      ],
      chart: {
        height: 350,
        width: 800,
        type: "line",
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: "",
        align: "center",
        offsetX: 110,
      },
      xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },
          title: {
            text: "Income (thousand crores)",
            style: {
              color: "#008FFB",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: "Income",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#00E396",
          },
          labels: {
            style: {
              colors: "#00E396",
            },
          },
          title: {
            text: "Operating Cashflow (thousand crores)",
            style: {
              color: "#00E396",
            },
          },
        },
        {
          seriesName: "Revenue",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#FEB019",
          },
          labels: {
            style: {
              colors: "#FEB019",
            },
          },
          title: {
            text: "Revenue (thousand crores)",
            style: {
              color: "#FEB019",
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40,
      },
    };
  }

  ngOnInit(): void {}

  /*getComplaintsData(): ComplaintsWithPercent[] {
    var data = complaintsData.sort(function (a, b) {
        return b.count - a.count;
      }),
      totalCount = data.reduce(function (prevValue, item) {
        return prevValue + item.count;
      }, 0),
      cumulativeCount = 0;
    return data.map(function (item, index) {
      cumulativeCount += item.count;
      return {
        complaint: item.complaint,
        count: item.count,
        cumulativePercent: Math.round((cumulativeCount * 100) / totalCount),
      };
    });
  }

  customizeTooltip = (info: any) => {
    return {
      html:
        "<div><div class='tooltip-header'>" +
        info.argumentText +
        "</div>" +
        "<div class='tooltip-body'><div class='series-name'>" +
        "<span class='top-series-name'>" +
        info.points[0].seriesName +
        "</span>" +
        ": </div><div class='value-text'>" +
        "<span class='top-series-value'>" +
        info.points[0].valueText +
        "</span>" +
        "</div><div class='series-name'>" +
        "<span class='bottom-series-name'>" +
        info.points[1].seriesName +
        "</span>" +
        ": </div><div class='value-text'>" +
        "<span class='bottom-series-value'>" +
        info.points[1].valueText +
        "</span>" +
        "% </div></div></div>",
    };
  };

  customizeLabelText = (info: any) => {
    return info.valueText + "%";
  };*/
}

export class ComplaintsWithPercent {
  complaint: string;
  count: number;
  cumulativePercent: number;
}

class Complaints {
  complaint: string;
  count: number;
}

let complaintsData: Complaints[] = [
  { complaint: "S01", count: 780 },
  { complaint: "S02", count: 120 },
  { complaint: "S03", count: 52 },
  { complaint: "S04", count: 1123 },
  { complaint: "S05", count: 321 },
  { complaint: "S06", count: 89 },
  { complaint: "S07", count: 222 },
  { complaint: "S08", count: 1123 },
  { complaint: "S09", count: 321 },
  { complaint: "S10", count: 89 },
  { complaint: "S11", count: 222 },
];
