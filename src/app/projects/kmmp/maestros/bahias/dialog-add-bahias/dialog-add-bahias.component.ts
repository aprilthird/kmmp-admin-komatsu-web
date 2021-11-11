import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BahiaI } from "../bahia-model";
import { BahiasService } from "../bahias.service";

@Component({
  selector: "app-dialog-add-bahias",
  templateUrl: "./dialog-add-bahias.component.html",
  styleUrls: ["./dialog-add-bahias.component.scss"],
})
export class DialogAddBahiasComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  initData: BahiaI;
  isEdit: boolean;
  bahiaId: number;
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bahiaService: BahiasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddBahiasComponent>
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.bahiaId = this.data.id;
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      estado: new FormControl(""),
      cliente: new FormControl(this.initData?.cliente, Validators.required),
    });
  }

  ngOnInit(): void {}

  submit(isEdit): void {
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.bahiaId));
    }
    const state = this.form.controls["estado"].value ? 1 : 0;
    this.form.controls["estado"].setValue(state);
    this.bahiaService.postBahia(this.form.value).subscribe(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.matdialigRef.close();
      }, 1000);
    });
  }
}
