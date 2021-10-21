import { Component, ViewChild, OnInit } from "@angular/core";
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
} from "ng-apexcharts";

//CONFIG
import { ChartOptions, chartOptionsData } from "../../config";

@Component({
  selector: "app-status-flota",
  templateUrl: "./status-flota.component.html",
  styleUrls: ["./status-flota.component.scss"],
})
export class StatusFlotaComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = chartOptionsData;
  }

  ngOnInit(): void {}
}
