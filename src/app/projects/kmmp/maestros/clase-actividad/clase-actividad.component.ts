import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionService } from "app/core/permission/permission.service";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MaestrosService } from "../maestros.service";
import { ClaseActividadI } from "./clase-actividad-model";
import { ClaseActividadService } from "./clase-actividad.service";
import { DialogAddClaseActividadComponent } from "./dialog-add-clase-actividad/dialog-add-clase-actividad.component";
import { DialogAddTipoMtmtoComponent } from "./dialog-add-tipo-mtmto/dialog-add-tipo-mtmto.component";

@Component({
  selector: "app-clase-actividad",
  templateUrl: "./clase-actividad.component.html",
  styleUrls: ["./clase-actividad.component.scss"],
})
export class ClaseActividadComponent implements OnInit {
  isLoading = true;
  selectedActivity: any;

  clase_actividades$: Observable<ClaseActividadI[]>;

  pagination$: Observable<Pagination>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  tipoMttos: any[] = [];
  idClaseActv: any;

  constructor(
    public _permissonService: PermissionService,
    private _routeActived: ActivatedRoute,
    private _router: Router,
    private matDialog: MatDialog,
    private claseActividadService: ClaseActividadService,
    private _maestrosService: MaestrosService
  ) {
    this.getClaseActividades();
  }

  ngOnInit(): void {
    this.loadData();
  }

  getClaseActividades(): void {
    this.clase_actividades$ =
      this.claseActividadService.clase_actividades$.pipe(
        takeUntil(this._unsubscribeAll)
      );

    this.pagination$ = this.claseActividadService.pagination$;
  }

  loadData() {
    this.isLoading = true;
    this.claseActividadService
      .getClaseActividad(this._routeActived.snapshot.queryParams)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setLoading(loading): void {
    this.isLoading = loading;
  }

  changePage(pagination: any): void {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this._router.onSameUrlNavigation = "reload";

    const params = this._routeActived.snapshot.params;
    this._router.navigate(["/admin/maestros/clase_actividades"], {
      queryParams: {
        ...params,
        pageSize: pagination.pageSize,
        page: pagination.pageIndex,
      },
    });
  }

  deleteClaseActividad(): void {}

  createClaseActividad(): void {
    this.matDialog
      .open(DialogAddClaseActividadComponent, {
        width: "400px",
        maxHeight: "100vh",
      })
      .afterClosed()
      .subscribe(() => this.loadData());
  }

  toggleDetails(actividad?): void {
    this.tipoMttos = [];
    this.idClaseActv = actividad.id;
    this.claseActividadService
      .getTipoMantenimiento({ idClaseActividad: actividad.id, pageSize: 999 })
      .subscribe((tipoMttos) => {
        this.tipoMttos = tipoMttos.body.data;
      });
    if (
      this.selectedActivity &&
      this.selectedActivity.nombre === actividad.nombre
    ) {
      this.selectedActivity = null;
      return;
    }
    this.selectedActivity = actividad;
  }

  createTipoMantenimeinto(params?): void {
    const dialog = this.matDialog.open(DialogAddTipoMtmtoComponent, {
      width: "400px",
      maxHeight: "100vh",
      data: { idClase: this.idClaseActv, dataEdit: params },
    });

    dialog.afterClosed().subscribe(() => {
      const returnedData = dialog.componentInstance.tipoMttoCreated;
      this.tipoMttos = this.tipoMttos.filter(
        (tipoMtto) => tipoMtto.id !== returnedData.id
      );
      dialog.componentInstance.tipoMttoCreated.nestado =
        returnedData.estado === 1 ? "Activo" : "Desactivado";
      this.tipoMttos.push(dialog.componentInstance.tipoMttoCreated);
    });
  }

  edit(equipo): void {
    this.matDialog
      .open(DialogAddClaseActividadComponent, {
        width: "400px",
        data: equipo,
      })
      .afterClosed()
      .subscribe(() => this.loadData());
  }

  pageSizeOpt(): number[] {
    const totalrecords = this._maestrosService.totalRecords.getValue();
    let pageSize = [5, 10, 25, 100];
    if (totalrecords > 100) {
      pageSize.push(totalrecords);
    }
    return pageSize;
  }
}
