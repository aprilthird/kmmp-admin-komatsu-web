import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ListadoService } from "app/projects/kmmp/formatos/listado/listado.services";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { ActivitiesService } from "../../activities.service";
import { FilterI } from "./../../../../../shared/models/filters-model";

@Component({
  selector: "app-filter-dialog",
  templateUrl: "./filter-dialog.component.html",
  styleUrls: ["./filter-dialog.component.scss"],
})
export class FilterDialogComponent implements OnInit {
  filters = Filters;

  form: FormGroup;
  loading: boolean;
  modelosOpt: any;
  actividadOpt: any;
  clientes: any;
  equipoOpt: any;
  filterService: FilterI;
  isLoading: boolean;
  estadosOpt: any;
  tipoSolicitudOpt: any;

  constructor(
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<FilterDialogComponent>,
    private serviceAct: ActivitiesService,
    private listadoService: ListadoService,
    private _activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idModelo: new FormControl(undefined),
      idClaseActividad: new FormControl(undefined),
    });
    if (this.data.source === "activities") {
      this.form.addControl("idEquipo", new FormControl(undefined));
      this.form.addControl("idEstado", new FormControl(undefined));
      this.form.addControl("idTipoSolicitud", new FormControl(undefined));
    } else if (this.data.source === "formats") {
      this.form.addControl("idCliente", new FormControl(undefined));
    }
  }

  ngOnInit(): void {
    this.getFilters();
    this.getInboxes();
  }

  private getInboxes(): void {
    this.loading = true;

    let equipo = this.serviceAct.getList(2).pipe(map((x: any) => x.body.data));
    let modelos = this.serviceAct.getList(5).pipe(map((x: any) => x.body.data));
    let c_act = this.serviceAct.getList(7).pipe(map((x: any) => x.body.data));
    let cliente = this.serviceAct.getList(1).pipe(map((x: any) => x.body.data));
    let estados = this.serviceAct
      .getResources(10)
      .pipe(map((x: any) => x.body));
    let tipoSolicitudes = this.serviceAct
      .getResources(7)
      .pipe(map((x: any) => x.body));

    forkJoin([
      equipo,
      modelos,
      c_act,
      cliente,
      estados,
      tipoSolicitudes,
    ]).subscribe((result: any) => {
      this.equipoOpt = result[0];
      this.modelosOpt = result[1];
      this.actividadOpt = result[2];
      this.clientes = result[3];
      this.estadosOpt = result[4];
      this.tipoSolicitudOpt = result[5];
      this.loading = false;
    });
  }

  getFilters(): void {
    this.listadoService._filter.subscribe((filter) => {
      this.form.patchValue(filter);
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    if (this.data.source === "activities") {
      this._activitiesService
        .getActivities({ ...this.form.value })
        .subscribe(() => {
          this.listadoService._filter.next(this.form.value);
          this.isLoading = false;
          this.matdialigRef.close();
        });
    } else if (this.data.source === "formats") {
      this.listadoService
        .getFormatos({
          ...this.form.value,
        })
        .subscribe(() => {
          this.listadoService._filter.next(this.form.value);
          this.isLoading = false;
          this.matdialigRef.close();
        });
    }
  }

  wipeFilters(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key).setValue(undefined);
    });

    this.listadoService._filter.next(this.form.controls.value);
  }
}

const Filters = {
  estados: [
    {
      id: 1,
      name: "Activo",
    },
    {
      id: 0,
      name: "Inactivo",
    },
  ],
};
