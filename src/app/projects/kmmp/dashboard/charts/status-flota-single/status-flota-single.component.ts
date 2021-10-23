import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

//CONFIG
import {
  SimplePieChartOptions,
  BasicBarChartOptions,
  SingleStatusXFlota,
  BasiBarChart,
} from "../../config";

@Component({
  selector: "status-flota-single",
  templateUrl: "./status-flota-single.component.html",
  styleUrls: ["./status-flota-single.component.scss"],
})
export class StatusFlotaSingleComponent implements OnInit {
  @ViewChild("pieChart") pieChart: ChartComponent;
  @ViewChild("barChart") barChart: ChartComponent;
  public pieChartData: Partial<SimplePieChartOptions>;
  public basicBarChartData: Partial<BasicBarChartOptions>;
  colors = ["#1e61cb", "#8ac8db"];
  legend = {
    position: "bottom",
  };

  general = {
    text: "General - auxiliar",
  };

  state = {
    text: "Por estado",
  };

  constructor() {
    this.pieChartData = SingleStatusXFlota;
    this.basicBarChartData = BasiBarChart;
  }

  ngOnInit(): void {}
}
