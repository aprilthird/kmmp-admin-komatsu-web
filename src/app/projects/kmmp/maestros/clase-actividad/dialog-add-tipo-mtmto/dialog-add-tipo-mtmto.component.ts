import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ClaseActividadService } from "../clase-actividad.service";

@Component({
  selector: "app-dialog-add-tipo-mtmto",
  templateUrl: "./dialog-add-tipo-mtmto.component.html",
  styleUrls: ["./dialog-add-tipo-mtmto.component.scss"],
})
export class DialogAddTipoMtmtoComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  constructor(
    private claseActividadService: ClaseActividadService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddTipoMtmtoComponent>
  ) {
    this.form = this.fb.group({
      codigo: new FormControl("", Validators.required),
      descripcion: new FormControl("", Validators.required),
      estado: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.claseActividadService
      .postTipoMantenimeinto(this.form.value)
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
