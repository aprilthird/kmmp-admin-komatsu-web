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

  colors = ["#12239E", "#85B6FF"];
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

      this.BasiBarChart.plotOptions.bar.colors.backgroundBarColors = [];
      this.BasiBarChart.plotOptions.bar.colors.ranges = [
        { from: 0, to: 10, color: "#00A7FF" },
        { from: 10, to: 50, color: "#140A9A" },
        { from: 51, to: 100, color: "#CBF266" },
        { from: 101, to: 2000, color: "#140A9A" },
      ];
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
