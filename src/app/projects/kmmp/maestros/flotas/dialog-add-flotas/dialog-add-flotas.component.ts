import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FlotasService } from "../flotas.service";

@Component({
  selector: "app-dialog-add-flotas",
  templateUrl: "./dialog-add-flotas.component.html",
  styleUrls: ["./dialog-add-flotas.component.scss"],
})
export class DialogAddFlotasComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  constructor(
    private flotaService: FlotasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddFlotasComponent>
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      estado: new FormControl(""),
      cliente: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.flotaService.postFlota(this.form.value).subscribe((resp) => {
      console.log(resp);
    });
  }
}
