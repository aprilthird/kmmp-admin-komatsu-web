import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FlotaI } from "../flota-model";
import { FlotasService } from "../flotas.service";

@Component({
  selector: "app-dialog-add-flotas",
  templateUrl: "./dialog-add-flotas.component.html",
  styleUrls: ["./dialog-add-flotas.component.scss"],
})
export class DialogAddFlotasComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  initData: FlotaI;
  isEdit: boolean;
  flotaId: number;
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private flotaService: FlotasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddFlotasComponent>
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.flotaId = this.data.id;
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      cliente: new FormControl(this.initData?.cliente, Validators.required),
      estado: new FormControl(this.initData?.nestado === "Activo" ? 1 : 0),
    });
  }

  ngOnInit(): void {}

  submit(isEdit): void {
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.flotaId));
    }

    this.flotaService.postFlota(this.form.value).subscribe(() => {
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
