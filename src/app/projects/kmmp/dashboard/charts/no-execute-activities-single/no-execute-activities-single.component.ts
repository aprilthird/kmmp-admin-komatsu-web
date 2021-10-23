import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import {
  BasiBarChartNoExec,
  BasicBarChartOptions,
  BasiBarChartNoExecCausas,
} from "../../config";

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
    text: "Postergadas 150",
  };
  Causas = {
    text: "Causas",
  };

  constructor() {
    this.basicBarChartData = BasiBarChartNoExec;
    this.basicBarCharHortData = BasiBarChartNoExecCausas;
  }

  ngOnInit(): void {}
}
