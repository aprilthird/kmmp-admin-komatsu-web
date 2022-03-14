import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { StackedBarChartOptions } from "../../chart-model";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "no-execute-activities",
  templateUrl: "./no-execute-activities.component.html",
  styleUrls: ["./no-execute-activities.component.scss"],
})
export class NoExecuteActivitiesComponent implements OnInit {
  @ViewChild("stackedChartNoActv") stackedChartNoActv: ChartComponent;
  public noActivitiesExec: Partial<StackedBarChartOptions>;
  display: boolean;
  constructor(private dashboardservices: DashboardService) {
    this.dashboardservices.activitiesNoCompleted$.subscribe((resp) => {
      delete resp.chart.width;
      this.noActivitiesExec = resp;

      this.noActivitiesExec.plotOptions.bar.colors = {};
      this.noActivitiesExec.plotOptions.bar.colors.backgroundBarColors = [];
      this.noActivitiesExec.dataLabels = {
        formatter: (val: any) => (val !== 0 ? val : ""),
      };

      this.noActivitiesExec.plotOptions.bar.colors.ranges = [
        { from: 0, to: 10, color: "#00A7FF" },
        { from: 10, to: 50, color: "#7030A0" },
        { from: 51, to: 100, color: "#CBF266" },
        { from: 101, to: 2000, color: "#140A9A" },
      ];
    });
  }

  ngOnInit(): void {}
}
