import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { ClaseActividadService } from "../clase-actividad.service";

@Component({
  selector: "app-dialog-add-tipo-mtmto",
  templateUrl: "./dialog-add-tipo-mtmto.component.html",
  styleUrls: ["./dialog-add-tipo-mtmto.component.scss"],
})
export class DialogAddTipoMtmtoComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  tipoMttoCreated: any;

  isEdit: boolean;
  claseActividadId: number;
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private claseActividadService: ClaseActividadService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddTipoMtmtoComponent>
  ) {
    this.form = this.fb.group({
      codigo: new FormControl(this.data?.dataEdit?.nombre, Validators.required),
      descripcion: new FormControl(
        this.data?.dataEdit?.descripcion,
        Validators.required
      ),
      estado: new FormControl(
        this.data?.dataEdit?.nestado === "Activo" ? 1 : 0
      ),
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  submit(): void {
    this.isLoading = true;
    let payload;
    if (this.data?.dataEdit) {
      payload = {
        ...this.data.dataEdit,
        estado: this.form.controls["estado"].value ? 1 : 0,
        codido: this.form.controls["codigo"].value,
        descripcion: this.form.controls["descripcion"].value,
        nombre: this.form.controls["codigo"].value,
        idClaseActividad: this.data.idClase,
        filter: {
          idClaseActividad: this.data.idClase,
          tipo: 8,
          nombre: this.form.controls["codigo"].value,
          estado: this.form.controls["estado"].value ? 1 : 0,
          descripcion: this.form.controls["descripcion"].value,
        },
      };
    } else {
      payload = {
        estado: this.form.controls["estado"].value ? 1 : 0,
        codido: this.form.controls["codigo"].value,
        descripcion: this.form.controls["descripcion"].value,
        nombre: this.form.controls["codigo"].value,
        idClaseActividad: this.data.idClase,
        filter: {
          idClaseActividad: this.data.idClase,
          tipo: 8,
          nombre: this.form.controls["codigo"].value,
          estado: this.form.controls["estado"].value ? 1 : 0,
          descripcion: this.form.controls["descripcion"].value,
        },
      };
    }

    this.claseActividadService
      .postTipoMantenimeinto(payload)
      .subscribe((resp) => {
        this.tipoMttoCreated = resp.body;
        this.isLoading = false;
        this.matdialigRef.close();
      });
  }

  check(event): void {
    setTimeout(() => {
      this.form.controls["estado"].setValue(event.checked ? 1 : 0);
    }, 200);
  }
}
