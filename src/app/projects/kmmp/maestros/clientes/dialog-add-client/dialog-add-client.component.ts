import { Component, Inject, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

//MODELS
import { ClientI } from "./../client-model";

//SERVICES
import { MaestrosService } from "../../maestros.service";
import { Subject } from "rxjs";
import { AzureService } from "app/core/azure/azure.service";

@Component({
  selector: "app-dialog-add-client",
  templateUrl: "./dialog-add-client.component.html",
  styleUrls: ["./dialog-add-client.component.scss"],
})
export class DialogAddClientComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  isEdit: boolean;
  clientId: number;
  initData: ClientI;
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddClientComponent>,
    private maestroService: MaestrosService,
    private _azureService: AzureService
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.clientId = this.data.id;
    }

    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, [Validators.required]),
      ruc: new FormControl(this.initData?.ruc, [
        Validators.required,
        Validators.pattern("^[0-9]{11}$"),
      ]),
      razon: new FormControl(this.initData?.razon, Validators.required),
      ubicacion: new FormControl(this.initData?.ubicacion, Validators.required),
      estado: new FormControl(
        !this.initData?.nestado
          ? 1
          : this.initData?.nestado === "Activo"
          ? 1
          : 0
      ),
      img: new FormControl(),
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  submit(isEdit): void {
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.clientId));
    }

    this.form.controls["ruc"].setValue(
      this.form.controls["ruc"].value.toString()
    );

    this.maestroService.postClient(this.form.value).subscribe((resp) => {
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

  maxLengValidator(): boolean {
    if (this.form.controls["ruc"].value) {
      if (this.form.controls["ruc"].value.toString().length > 10) return false;
    }

    return true;
  }

  setImage(src: string): string {
    return this._azureService.getResourceUrlComplete(src);
  }

  async onFileChange(e) {
    if (e) {
      const { target } = e;
      const file = target.files[0];
      const blob = new Blob([file], { type: file.type });
      try {
        const response = await this._azureService.uploadFile(blob, file.name);
        this.form.get("img").setValue(response.uuidFileName);
      } catch (e) {}
    } else {
      this.form.get("img").setValue("");
    }
  }
}
