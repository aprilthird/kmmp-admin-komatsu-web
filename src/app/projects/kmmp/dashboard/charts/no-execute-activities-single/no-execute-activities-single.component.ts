import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
//import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { BasicBarChartOptions } from "../../chart-model";
import {
  CausesChart,
  ColorRangesPlotOptions,
  Postponed,
} from "../../dashboaard.config";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "no-execute-activities-single",
  templateUrl: "./no-execute-activities-single.component.html",
  styleUrls: ["./no-execute-activities-single.component.scss"],
})
export class NoExecuteActivitiesSingleComponent implements OnInit {
  @Input() postponed: boolean;
  public basicBarCharHortData: Partial<BasicBarChartOptions> = CausesChart;
  basicBarChartData = Postponed;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  Postergadas = {
    text: "",
  };
  Causas = {
    text: "Causas",
  };
  display: boolean;
  loading: boolean;

  //@ViewChild("barChart") barChart: ChartComponent;
  //@ViewChild("barChartHor") barChartHor: ChartComponent;
  //public basicBarChartData; //= Postponed; //Partial<BasicBarChartOptions>;
  //public basicBarChartData: Partial<BasicBarChartOptions>;

  constructor(private dashboardService: DashboardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.postponed.currentValue) {
      this.setPostponedData();
    } else {
      this.setNoExecutedData();
    }
  }

  ngOnInit(): void {}

  private setPostponedData(): void {
    this.Postergadas.text = "Postergadas";
    this.dashboardService._postponed
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((posponed) => {
        this.loading = true;
        if (posponed) {
          this.basicBarChartData.plotOptions.bar = { horizontal: false };
          this.basicBarChartData.series[0].data = posponed.map((x) => x[1]);
          this.basicBarChartData.xaxis.categories = posponed.map((x) => x[0]);
          this.basicBarChartData.plotOptions.bar.colors = {};

          this.basicBarChartData.plotOptions.bar.colors.ranges =
            ColorRangesPlotOptions;
        }

        setTimeout(() => {
          this.loading = false;
        }, 500);
      });

    this.dashboardService._postponedCauses.subscribe((postponedCauses) => {
      if (postponedCauses) {
        this.basicBarCharHortData.series[0].data = postponedCauses.map(
          (x) => x[1]
        );
        this.basicBarCharHortData.xaxis.categories = postponedCauses.map(
          (x) => x[0]
        );
      }

      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }

  private setNoExecutedData(): void {
    this.Postergadas.text = "No ejecutadas";
    this.dashboardService._noExecuted
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((_noExecuted) => {
        this.loading = true;
        if (_noExecuted) {
          this.basicBarChartData.plotOptions.bar = { horizontal: false };
          this.basicBarChartData.series[0].data = _noExecuted.map((x) => x[1]);
          this.basicBarChartData.xaxis.categories = _noExecuted.map(
            (x) => x[0]
          );
          this.basicBarChartData.plotOptions.bar.colors = {};
          this.basicBarChartData.plotOptions.bar.colors.ranges =
            ColorRangesPlotOptions;
        }

        setTimeout(() => {
          this.loading = false;
        }, 500);
      });

    this.dashboardService._noExecutedCauses.subscribe((noExecutedCauses) => {
      if (noExecutedCauses) {
        this.basicBarCharHortData.series[0].data = noExecutedCauses.map(
          (x) => x[1]
        );
        this.basicBarCharHortData.xaxis.categories = noExecutedCauses.map(
          (x) => x[0]
        );
      }

      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }

  // displayPostponedChart(): boolean {
  //   return this.basicBarChartData?.series[0].data.some((x) => x > 0);
  // }

  // displayNoExecutedChart(): boolean {
  //   return this.basicBarChartData?.series[0].data.some((x) => x > 0);
  // }
}
