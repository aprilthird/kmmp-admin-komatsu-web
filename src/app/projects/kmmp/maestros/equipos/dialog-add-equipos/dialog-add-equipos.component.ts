import { Component, Inject, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

//MODELS
import { EquipoI } from "../equipo-model";

//SERVICES
import { EquiposService } from "../equipos.service";

@Component({
  selector: "app-dialog-add-equipos",
  templateUrl: "./dialog-add-equipos.component.html",
  styleUrls: ["./dialog-add-equipos.component.scss"],
})
export class DialogAddEquiposComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  initData: EquipoI;
  isEdit: boolean;
  equipoId: number;
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private equiposService: EquiposService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddEquiposComponent>
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.equipoId = this.data.id;
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      tag: new FormControl(this.initData?.tag, Validators.required),
      modelo: new FormControl(this.initData?.modelo, Validators.required),
      flota: new FormControl(this.initData?.flota, Validators.required),
      cliente: new FormControl(this.initData?.cliente, Validators.required),
      horometro: new FormControl(this.initData?.horometro, Validators.required),
      estado: new FormControl(this.initData?.nestado === "Activo" ? 1 : 0),
    });

    this.form.controls["cliente"].disable();
    this.form.controls["horometro"].disable();
  }

  ngOnInit(): void {}

  submit(isEdit): void {
    this.isLoading = true;

    /*if (isEdit) {
      this.form.addControl("id", new FormControl(this.equipoId));
    }*/

    this.equiposService.postEquipo(this.form.value).subscribe((resp) => {
      setTimeout(() => {
        this.isLoading = false;
        this.matdialigRef.close();
      }, 1000);
    });
  }

  check(event): void {
    setTimeout(() => {
      this.form.controls["estado"].setValue(event.checked ? 1 : 0);
    }, 200);
  }
}
