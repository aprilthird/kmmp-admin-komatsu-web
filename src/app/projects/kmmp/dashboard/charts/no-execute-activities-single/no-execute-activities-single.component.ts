import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { BasicBarChartOptions } from "../../chart-model";
import { Postponed } from "../../dashboaard.config";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "no-execute-activities-single",
  templateUrl: "./no-execute-activities-single.component.html",
  styleUrls: ["./no-execute-activities-single.component.scss"],
})
export class NoExecuteActivitiesSingleComponent implements OnInit {
  @ViewChild("barChart") barChart: ChartComponent;
  @Input() postponed: boolean;
  //public basicBarChartData; //= Postponed; //Partial<BasicBarChartOptions>;
  //public basicBarChartData: Partial<BasicBarChartOptions>;

  @ViewChild("barChartHor") barChartHor: ChartComponent;
  public basicBarCharHortData: Partial<BasicBarChartOptions>;

  Postergadas = {
    text: "",
  };
  Causas = {
    text: "Causas",
  };
  display: boolean;
  loading: boolean;
  basicBarChartData = Postponed;

  constructor(private dashboardService: DashboardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.postponed.currentValue) {
      this.Postergadas.text = "Postergadas";
      this.dashboardService._postponed.subscribe((posponed) => {
        this.loading = true;
        if (posponed) {
          this.basicBarChartData.plotOptions.bar = { horizontal: false };
          this.basicBarChartData.series[0].data = posponed.map((x) => x[1]);
          this.basicBarChartData.xaxis.categories = posponed.map((x) => x[0]);
          this.basicBarChartData.plotOptions.bar.colors = {};

          this.basicBarChartData.plotOptions.bar.colors.ranges = [
            { from: 0, to: 10, color: "#00A7FF" },
            { from: 10, to: 50, color: "#140A9A" },
            { from: 51, to: 100, color: "#CBF266" },
            { from: 101, to: 2000, color: "#140A9A" },
          ];

          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      });
    } else {
      this.Postergadas.text = "No ejecutadas";
      this.dashboardService._noExecuted.subscribe((_noExecuted) => {
        this.loading = true;
        if (_noExecuted) {
          this.basicBarChartData.plotOptions.bar = { horizontal: false };
          this.basicBarChartData.series[0].data = _noExecuted.map((x) => x[1]);
          this.basicBarChartData.xaxis.categories = _noExecuted.map(
            (x) => x[0]
          );
          this.basicBarChartData.plotOptions.bar.colors = {};
          this.basicBarChartData.plotOptions.bar.colors.ranges = [
            { from: 0, to: 10, color: "#00A7FF" },
            { from: 10, to: 50, color: "#140A9A" },
            { from: 51, to: 100, color: "#CBF266" },
            { from: 101, to: 2000, color: "#140A9A" },
          ];

          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      });
    }
  }

  ngOnInit(): void {}

  displayPostponedChart(): boolean {
    return this.basicBarChartData?.series[0].data.some((x) => x > 0);
  }

  displayNoExecutedChart(): boolean {
    return this.basicBarChartData?.series[0].data.some((x) => x > 0);
  }
}
