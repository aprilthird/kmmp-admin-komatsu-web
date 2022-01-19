import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
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

  constructor(
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<FilterDialogComponent>,
    private serviceAct: ActivitiesService,
    private listadoService: ListadoService
  ) {
    this.form = this.fb.group({
      idCliente: new FormControl(0),
      idModelo: new FormControl(0),
      idEquipo: new FormControl(0),
      idClaseActividad: new FormControl(0),
    });
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

    forkJoin([equipo, modelos, c_act, cliente]).subscribe((result: any) => {
      this.equipoOpt = result[0];
      this.modelosOpt = result[1];
      this.actividadOpt = result[2];
      this.clientes = result[3];
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.listadoService
      .getFormatos({
        ...this.form.value,
      })
      .subscribe((resp) => {
        this.listadoService._filter.next(this.form.value);
        this.matdialigRef.close();
      });
  }

  wipeFilters(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key).setValue("");
      this.listadoService._filter.next(null);
    });
  }

  private getFilters(): void {
    this.listadoService._filter.subscribe((resp) => {
      this.filterService = resp;
      if (this.filterService) {
        this.setFilter(resp);
      }
    });
  }

  private setFilter(filter: FilterI): void {
    this.form.controls["idModelo"].setValue(filter.modelo);
    this.form.controls["idEquipo"].setValue(filter.equipo);
    this.form.controls["idClaseActividad"].setValue(filter.actividad);
    this.form.controls["estados"].setValue(filter.estado);
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
