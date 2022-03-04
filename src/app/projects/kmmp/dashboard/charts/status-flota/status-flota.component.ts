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
import { GroupBarChartOptions } from "../../chart-model";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "app-status-flota",
  templateUrl: "./status-flota.component.html",
  styleUrls: ["./status-flota.component.scss"],
})
export class StatusFlotaComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<GroupBarChartOptions>;

  constructor(private dashboardServices: DashboardService) {
    this.dashboardServices.statusFlota$.subscribe((resp) => {
      this.chartOptions = resp;
      this.chartOptions.xaxis.categories =
        this.chartOptions.xaxis.categories.filter((x) => x !== "Todas");

      this.chartOptions.color = ["#85B6FF", "#12239E", "#7275b0"];
      delete this.chartOptions.chart.width;
    });
  }

  ngOnInit(): void {}
}
