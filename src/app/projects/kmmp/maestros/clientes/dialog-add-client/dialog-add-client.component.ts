import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

//MODELS
import { ClientI } from "./../client-model";

//SERVICES
import { MaestrosService } from "../../maestros.service";

@Component({
  selector: "app-dialog-add-client",
  templateUrl: "./dialog-add-client.component.html",
  styleUrls: ["./dialog-add-client.component.scss"],
})
export class DialogAddClientComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  constructor(
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddClientComponent>,
    private maestroService: MaestrosService
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      ruc: new FormControl("", Validators.required),
      razon_social: new FormControl("", Validators.required),
      ubicacion: new FormControl("", Validators.required),
      estado: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.maestroService.postClient(this.form.value).subscribe((resp) => {
      console.log(resp);
    });
  }
}
