import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private dashboardservices: DashboardService) {
    this.dashboardservices.activitiesNoCompleted$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resp) => {
        delete resp.chart.width;
        this.noActivitiesExec = resp;

        this.noActivitiesExec.plotOptions.bar.colors = {};
        this.noActivitiesExec.plotOptions.bar.colors.backgroundBarColors = [];
        this.noActivitiesExec.dataLabels = {
          formatter: (val: any) => (val !== 0 ? val : ""),
        };

        this.noActivitiesExec.plotOptions.bar.colors.ranges = [
        ];
      });
  }

  ngOnInit(): void {}
}
