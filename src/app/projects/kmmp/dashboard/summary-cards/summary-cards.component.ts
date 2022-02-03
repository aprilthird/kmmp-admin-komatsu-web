import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../dashboard.service";

@Component({
  selector: "app-summary-cards",
  templateUrl: "./summary-cards.component.html",
  styleUrls: ["./summary-cards.component.scss"],
})
export class SummaryCardsComponent implements OnInit {
  summary: SummaryChart;

  constructor(private dashboardServices: DashboardService) {
    this.dashboardServices.summary$.subscribe((resp) => {
      this.summary = resp;
    });
  }

  ngOnInit(): void {}
}

interface SummaryChart {
  observadas: number;
  sinEmpezar: number;
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  validadas: number;
  enProceso: number;
}
