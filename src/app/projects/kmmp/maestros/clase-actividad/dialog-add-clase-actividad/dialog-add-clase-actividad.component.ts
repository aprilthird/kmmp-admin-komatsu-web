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
  selector: "app-dialog-add-clase-actividad",
  templateUrl: "./dialog-add-clase-actividad.component.html",
  styleUrls: ["./dialog-add-clase-actividad.component.scss"],
})
export class DialogAddClaseActividadComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  constructor(
    private claseActividadService: ClaseActividadService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddClaseActividadComponent>
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      estado: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.claseActividadService
      .postClaseActivida(this.form.value)
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
