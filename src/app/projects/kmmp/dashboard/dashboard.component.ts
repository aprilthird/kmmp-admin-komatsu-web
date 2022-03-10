import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { setFormatDate } from "app/shared/utils/dates-format";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivitiesService } from "../actividades/activities.service";
import { ClaseActividadService } from "../maestros/clase-actividad/clase-actividad.service";
import { FlotaI } from "../maestros/flotas/flota-model";
import { MaestrosService } from "../maestros/maestros.service";
import { Status } from "./dashboaard.config";
import { DashboardService } from "./dashboard.service";

//FAKE DATA
import { filter } from "./filters/fake-db/fake-db";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  dateRange = new FormGroup({
    startDate: new FormControl({ value: null }),
    endDate: new FormControl({ value: null }),
  });
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  //flotas: FlotaI[] = [];
  flotas: string[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  clients$: Observable<any>;
  client = "Todos los clientes";

  user: User;
  isLoading: boolean;
  data = filter;
  _allFlotas = true;
  _allNoExecuted = true;
  start: string;
  end: string;
  tipo_solicitudes: any[] = [];
  idTipoSolicitud = new FormControl(undefined);
  clase_actividades: any[] = [];
  idClaseActividad = new FormControl(undefined);
  filter: {
    fechaIni: string;
    fechaFin: string;
    idClaseActividad?: number;
    idTipoSolicitud?: number;
    idCliente?: number;
  };
  isLoadingNoExc: boolean;
  idCliente: any;
  postponed: boolean;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _dashboardService: DashboardService,
    private serviceAct: ActivitiesService,
    private claseActividadService: ClaseActividadService,
    private _maestrosService: MaestrosService
  ) {
    this._userService.user$;
    this.getFlotas();
    this.getClients();
  }

  ngOnInit(): void {
    // Attach SVG fill fixer to all ApexCharts
    window["Apex"] = {
      chart: {
        events: {
          mounted: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
          updated: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
        },
      },
    };

    // Subscribe to user changes
    this._userService.user$.subscribe((user: User) => {
      this.user = user;
    });

    this.dateRange.patchValue(this._dashboardService._rangeDate.getValue());
    this.displayStringDate(true);
    this.getTipoSolicitud();
    this.getClaseActividades();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getClients(): void {
    this.clients$ = this._maestrosService.clients$.pipe(
      takeUntil(this._unsubscribeAll)
    );
  }

  change(): void {
    const startDate = new Date(this.dateRange.controls["startDate"].value);
    const endDate = new Date(this.dateRange.controls["endDate"].value);
    this.displayStringDate();

    this.filter = {
      fechaIni: setFormatDate(startDate),
      fechaFin: setFormatDate(endDate),
      idClaseActividad: this.idClaseActividad.value
        ? this.idClaseActividad.value
        : undefined,
      idTipoSolicitud: this.idTipoSolicitud.value
        ? this.idTipoSolicitud.value
        : undefined,
      idCliente: this.idCliente ? this.idCliente : undefined,
    };
    if (Number(setFormatDate(endDate).split("-")[0]) > 2020) {
      this._dashboardService.getStatusFlota(this.filter).subscribe(() => {});

      this._dashboardService.getCodigoDemora(this.filter).subscribe(() => {});

      this._dashboardService
        .getActividadesNoEjecutadas(this.filter)
        .subscribe(() => {});
    }
  }

  setClient(client): void {
    this.idCliente = client.id;
    this.client = client.nombre;
    this.change();
  }

  changeActivity(e: MatSelectChange): void {
    this.idClaseActividad.setValue(e.value);
    this.change();
  }

  changeRequest(e: MatSelectChange): void {
    this.idTipoSolicitud.setValue(e.value);
    this.change();
  }

  private displayStringDate(init?: boolean): void {
    if (this.dateRange.controls["startDate"].value) {
      this.start = !init
        ? new Date(
            this.dateRange.controls["startDate"].value
          ).toLocaleDateString("en-GB")
        : new Date(
            this.dateRange.controls["startDate"].value
          ).toLocaleDateString("en-GB");
    }
    if (this.dateRange.controls["endDate"].value) {
      this.end = !init
        ? new Date(this.dateRange.controls["endDate"].value).toLocaleDateString(
            "en-GB"
          )
        : new Date(this.dateRange.controls["endDate"].value).toLocaleDateString(
            "en-GB"
          );
    }
  }

  getFlotas(): void {
    // this._maestrosService
    //   .getList({ tipo: 6, pageSize: 999 })
    //   .subscribe((resp: any) => {
    //     this.flotas = resp.body.data;
    //     this.flotas.unshift({ id: 999, nombre: "Todas" });
    //   });

    this._dashboardService.categorie$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((flotas) => {
        this.flotas = flotas;
        this.flotas.unshift("Todas");
      });
  }

  private getTipoSolicitud(): void {
    this.serviceAct.getResources(7).subscribe((resp) => {
      this.tipo_solicitudes = resp.body;
    });
  }

  getClaseActividades(): void {
    this.claseActividadService
      .getClaseActividad({ pageSize: 999 })
      .subscribe((resp) => {
        this.clase_actividades = resp.body.data;
      });
  }

  selectFlotas(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this._allFlotas = true;
    } else {
      //this.isLoading = true;
      this._allFlotas = false;
      // this._dashboardService
      //   .getStatusFlotaById(
      //     this.flotas.find((flota) => flota.nombre === event.tab.textLabel).id
      //   )
      //   .subscribe(() => (this.isLoading = false));

      const series = this._dashboardService._seriesStatus.getValue();
      const executed = series.find((x) => x.name === Status.EXECUTED)["data"][
        event.index - 1
      ];
      const noExecuted = series.find((x) => x.name === Status.NO_EXECUTED)[
        "data"
      ][event.index - 1];

      const postponed = series.find((x) => x.name === Status.POSTPONED)["data"][
        event.index - 1
      ];

      this._dashboardService._currentSingleStatus.next([
        executed,
        noExecuted,
        postponed,
      ]);
    }
  }

  allNoExecuted(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this._allNoExecuted = true;
    } else {
      this.isLoadingNoExc = true;
      this._allNoExecuted = false;
      this.postponed = event.index === 1 ? true : false;
      // this._dashboardService
      //   .getNoExecuteActivitiesyState(this.filter)
      //   .subscribe(() => (this.isLoadingNoExc = false));
    }
  }

  /**
   * Prepare the chart data from the data
   *
   * @private
   */

  /**
   * Fix the SVG fill references. This fix must be applied to all ApexCharts
   * charts in order to fix 'black color on gradient fills on certain browsers'
   * issue caused by the '<base>' tag.
   *
   * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
   *
   * @param element
   * @private
   */
  private _fixSvgFill(element: Element): void {
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll("*[fill]"))
      .filter((el) => el.getAttribute("fill").indexOf("url(") !== -1)
      .forEach((el) => {
        const attrVal = el.getAttribute("fill");
        el.setAttribute(
          "fill",
          `url(${currentURL}${attrVal.slice(attrVal.indexOf("#"))}`
        );
      });
  }
}
