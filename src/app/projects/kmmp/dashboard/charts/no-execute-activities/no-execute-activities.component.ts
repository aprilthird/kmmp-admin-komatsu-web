import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { StackedBarChartOptions, NoCompletedActvBarChart } from "../../config";

@Component({
  selector: "no-execute-activities",
  templateUrl: "./no-execute-activities.component.html",
  styleUrls: ["./no-execute-activities.component.scss"],
})
export class NoExecuteActivitiesComponent implements OnInit {
  @ViewChild("stackedChartNoActv") stackedChartNoActv: ChartComponent;
  public noActivitiesExec: Partial<StackedBarChartOptions>;
  constructor() {
    this.noActivitiesExec = NoCompletedActvBarChart;
  }

  ngOnInit(): void {}
}
