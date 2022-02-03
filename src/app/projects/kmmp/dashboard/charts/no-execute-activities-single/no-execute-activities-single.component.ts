import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { BasicBarChartOptions } from "../../chart-model";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "no-execute-activities-single",
  templateUrl: "./no-execute-activities-single.component.html",
  styleUrls: ["./no-execute-activities-single.component.scss"],
})
export class NoExecuteActivitiesSingleComponent implements OnInit {
  @ViewChild("barChart") barChart: ChartComponent;
  public basicBarChartData: Partial<BasicBarChartOptions>;

  @ViewChild("barChartHor") barChartHor: ChartComponent;
  public basicBarCharHortData: Partial<BasicBarChartOptions>;

  Postergadas = {
    text: "Estados",
  };
  Causas = {
    text: "Causas",
  };

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.activitiesNoCompletedByState$.subscribe((resp) => {
      if (resp) {
        resp.estado.plotOptions.bar = { horizontal: false };
        this.basicBarChartData = resp.estado;
        this.basicBarCharHortData = resp.causas;
      }
    });
  }

  ngOnInit(): void {}
}
