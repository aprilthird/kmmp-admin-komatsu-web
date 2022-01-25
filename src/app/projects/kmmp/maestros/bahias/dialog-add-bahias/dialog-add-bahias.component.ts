import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { MaestrosService } from "../../maestros.service";
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
  clienteOptions: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bahiaService: BahiasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddBahiasComponent>,
    private maestServ: MaestrosService
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.bahiaId = this.data.id;
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      estado: new FormControl(this.initData?.nestado === "Activo" ? 1 : 0),
      idCliente: new FormControl(this.initData?.idCliente, Validators.required),
    });

    this.setCliente();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private setCliente(): void {
    this.maestServ.getList(1).subscribe((resp: any) => {
      this.clienteOptions = resp.body.data;
    });
  }

  submit(isEdit): void {
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.bahiaId));
    }

    this.bahiaService.postBahia(this.form.value).subscribe(() => {
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
