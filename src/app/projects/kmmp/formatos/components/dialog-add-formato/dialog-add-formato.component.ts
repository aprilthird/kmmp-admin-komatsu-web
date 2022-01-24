import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActivitiesService } from "app/projects/kmmp/actividades/activities.service";
import { Activity } from "app/projects/kmmp/actividades/models/activities-model";
import { TipoMttoI } from "app/projects/kmmp/maestros/clase-actividad/clase-actividad-model";
import { ClientI } from "app/projects/kmmp/maestros/clientes/client-model";
import { ModeloI } from "app/projects/kmmp/maestros/modelos/modelo-model";
import { forkJoin, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { DialogAddFormatoService } from "./dialog-add-formato.service";

@Component({
  selector: "app-dialog-add-formato",
  templateUrl: "./dialog-add-formato.component.html",
  styleUrls: ["./dialog-add-formato.component.scss"],
})
export class DialogAddFormatoComponent implements OnInit {
  loading: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  form: FormGroup = this.fb.group({
    nombre: [null, Validators.required],
    idCliente: [null, Validators.required],
    idModelo: [null, Validators.required],
    idClaseActividad: [null, Validators.required],
    idTipoMantenimiento: [null, Validators.required],
  });
  clientsOpt: ClientI[] = [];
  modelosOpt: ModeloI[] = [];
  actividadOpt: Activity[] = [];
  tipo_mttoOpt: TipoMttoI[] = [];
  emptyTipoMtto: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddFormatoComponent>,
    private dialogAddFormatoService: DialogAddFormatoService,
    private router: Router,
    private serviceAct: ActivitiesService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.getInboxes();
    this.isEdit();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getInboxes(): void {
    this.loading = true;
    let clients = this.serviceAct.getList(1).pipe(map((x) => x.body.data));
    let modelos = this.serviceAct.getList(5).pipe(map((x) => x.body.data));
    let c_act = this.serviceAct.getList(7).pipe(map((x) => x.body.data));

    forkJoin([clients, modelos, c_act]).subscribe((result) => {
      this.clientsOpt = result[0];
      this.modelosOpt = result[1];
      this.actividadOpt = result[2];
      this.loading = false;
    });
  }

  onSubmit() {
    if (!this.loading && this.form.valid) {
      this.form.controls["idTipoMantenimiento"].enable();
      this.loading = true;
      if (this.data) {
        this.dialogAddFormatoService
          .agregarFormato({ ...this.data, ...this.form.value })
          .subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.dialogAddFormatoService
          .agregarFormato(this.form.value)
          .subscribe((response) => {
            this.router
              .navigateByUrl(
                "/admin/formatos/formato-dinamico/" + response.body.id
              )
              .then(() => {
                this.dialogRef.close();
              });
          });
      }
    }
  }

  private isEdit(): void {
    if (this.data) {
      this.setTipoMtto(this.data.idClaseActividad);
      const {
        nombre,
        idCliente,
        idModelo,
        idClaseActividad,
        idTipoMantenimiento,
      } = this.data;
      this.form.patchValue({
        nombre,
        idCliente,
        idModelo,
        idClaseActividad,
        idTipoMantenimiento,
      });
    }

    this.form.controls["idTipoMantenimiento"].disable();
  }

  setTipoMtto(idClaseActividad: number, isEvent?: boolean): void {
    this.serviceAct.getTipoMtto(9, idClaseActividad).subscribe((x) => {
      this.tipo_mttoOpt = x.body.data;
      if (isEvent) {
        this.form.controls["idTipoMantenimiento"].setValue(null);
        this.form.controls["idTipoMantenimiento"].enable();
      }

      if (this.tipo_mttoOpt.length === 0) {
        this.emptyTipoMtto = true;
      } else {
        this.emptyTipoMtto = false;
      }
    });
  }

  getErrorMessage(input: string) {
    const control = this.form.get(input);

    if (control.hasError("required")) {
      return "Campo requerido";
    }

    return control.hasError("email") ? "Formato de correo incorrecto" : "";
  }
}
