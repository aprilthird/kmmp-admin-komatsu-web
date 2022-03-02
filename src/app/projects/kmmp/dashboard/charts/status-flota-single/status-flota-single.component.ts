import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { SimplePieChartOptions, BasicBarChartOptions } from "../../chart-model";
import {
  BasiBarChart,
  pieChartViewData,
  pieViewData,
} from "../../dashboaard.config";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "status-flota-single",
  templateUrl: "./status-flota-single.component.html",
  styleUrls: ["./status-flota-single.component.scss"],
})
export class StatusFlotaSingleComponent implements OnInit {
  //@ViewChild("pieChart") pieChart: ChartComponent;
  //@ViewChild("barChart") barChart: ChartComponent;
  public pieChartData: Partial<SimplePieChartOptions>;
  public pieChartViewData: Partial<BasicBarChartOptions>;

  colors = ["#1e61cb", "#8ac8db"];
  legend = {
    position: "bottom",
  };

  general = {
    text: "General",
  };

  state = {
    text: "Por estado",
  };

  pieViewData = pieViewData;
  BasiBarChart = BasiBarChart;
  loading: boolean;

  constructor(private dashboardServices: DashboardService) {
    this.dashboardServices._currentSingleStatus.subscribe((res) => {
      this.loading = true;
      this.pieViewData.series[0] = res[0];
      this.pieViewData.series[1] = res[1] + res[2];
      this.BasiBarChart.series[0].data = res;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }

  ngOnInit(): void {}

  displayPieChart(): boolean {
    return this.pieViewData?.series.some((x) => x > 0);
  }

  displayBarChart(): boolean {
    return this.BasiBarChart?.series[0].data.some((x) => x > 0);
  }
}
