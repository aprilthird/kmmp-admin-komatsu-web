import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActivitiesService } from "app/projects/kmmp/actividades/activities.service";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { DialogAddFormatoService } from "./dialog-add-formato.service";

@Component({
  selector: "app-dialog-add-formato",
  templateUrl: "./dialog-add-formato.component.html",
  styleUrls: ["./dialog-add-formato.component.scss"],
})
export class DialogAddFormatoComponent implements OnInit {
  loading: boolean = false;

  form: FormGroup = this.fb.group({
    nombre: [null, Validators.required],
    idCliente: [null, Validators.required],
    idModelo: [null, Validators.required],
    idClaseActividad: [null, Validators.required],
    idTipoMantenimiento: [null, Validators.required],
  });
  clientsOpt: any;
  modelosOpt: any;
  actividadOpt: any;
  tipo_mttoOpt: any;
  emptyTipoMtto: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddFormatoComponent>,
    private dialogAddFormatoService: DialogAddFormatoService,
    private router: Router,
    private serviceAct: ActivitiesService
  ) {}

  ngOnInit(): void {
    this.getInboxes();
  }

  getInboxes(): void {
    this.loading = true;
    let clients = this.serviceAct.getList(1).pipe(map((x: any) => x.body.data));
    let modelos = this.serviceAct.getList(5).pipe(map((x: any) => x.body.data));
    let c_act = this.serviceAct.getList(7).pipe(map((x: any) => x.body.data));

    forkJoin([clients, modelos, c_act]).subscribe((result: any) => {
      this.clientsOpt = result[0];
      this.modelosOpt = result[1];
      this.actividadOpt = result[2];
      this.loading = false;
    });
  }

  onSubmit() {
    if (!this.loading && this.form.valid) {
      this.loading = true;
      this.dialogAddFormatoService
        .agregarFormato(this.form.value)
        .subscribe((response) => {
          this.router
            .navigateByUrl("/admin/formatos/editar/" + response.body.id + "/0")
            .then(() => {
              this.dialogRef.close();
            });
        });
    }
  }

  setTipoMtto(idClaseActividad: number): void {
    this.serviceAct.getTipoMtto(9, idClaseActividad).subscribe((x: any) => {
      this.tipo_mttoOpt = x.body.data;
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
