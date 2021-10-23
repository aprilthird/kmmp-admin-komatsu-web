import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import { StackedBarChartOptions, DelayedCode } from "../../config";

@Component({
  selector: "deleyed-code",
  templateUrl: "./deleyed-code.component.html",
  styleUrls: ["./deleyed-code.component.scss"],
})
export class DeleyedCodeComponent implements OnInit {
  @ViewChild("stackedChartDelay") stackedChartDelay: ChartComponent;
  public delayCode: Partial<StackedBarChartOptions>;

  constructor() {
    this.delayCode = DelayedCode;
  }

  ngOnInit(): void {}
}
