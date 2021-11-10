import { Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

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

  constructor(
    private equiposService: EquiposService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddEquiposComponent>
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      tag: new FormControl("", Validators.required),
      modelo: new FormControl("", Validators.required),
      flota: new FormControl("", Validators.required),
      estado: new FormControl("", Validators.required),
      cliente: new FormControl("", Validators.required),
      horometro: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.equiposService.postClient(this.form.value).subscribe((resp) => {
      console.log(resp);
    });
  }
}
