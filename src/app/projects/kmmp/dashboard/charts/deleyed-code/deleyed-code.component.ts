import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { StackedBarChartOptions } from "../../chart-model";

//SERVICES
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "deleyed-code",
  templateUrl: "./deleyed-code.component.html",
  styleUrls: ["./deleyed-code.component.scss"],
})
export class DeleyedCodeComponent implements OnInit {
  @ViewChild("stackedChartDelay") stackedChartDelay: ChartComponent;
  public delayCode: Partial<StackedBarChartOptions>;

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.delayedCode$.subscribe((x) => {
      x.xaxis = {
        categories: ["Detalle de demora"],
        labels: {
          formatter: function (val) {
            return val + "K";
          },
        },
      };

      x.yaxis = {
        title: {
          text: undefined,
        },
      };
      if (x) {
        this.delayCode = x;
        this.delayCode.plotOptions.bar.colors = {};
        this.delayCode.plotOptions.bar.colors.ranges = [
          { from: 0, to: 10, color: "#140A9A" },
          { from: 10, to: 50, color: "#140A9A" },
          { from: 51, to: 100, color: "#CBF266" },
          { from: 101, to: 2000, color: "#140A9A" },
        ];
      }
    });
  }

  ngOnInit(): void {}
}
