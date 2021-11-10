import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { BahiasService } from "../bahias.service";

@Component({
  selector: "app-dialog-add-bahias",
  templateUrl: "./dialog-add-bahias.component.html",
  styleUrls: ["./dialog-add-bahias.component.scss"],
})
export class DialogAddBahiasComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  constructor(
    private bahiaService: BahiasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddBahiasComponent>
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      estado: new FormControl(""),
      cliente: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.bahiaService.postBahia(this.form.value).subscribe((resp) => {
      console.log(resp);
    });
  }
}
