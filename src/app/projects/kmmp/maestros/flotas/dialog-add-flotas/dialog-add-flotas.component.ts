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
  clienteOptions: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private flotaService: FlotasService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddFlotasComponent>,
    private maestServ: MaestrosService
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.flotaId = this.data.id;
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      idCliente: new FormControl(this.initData?.idCliente, Validators.required),
      estado: new FormControl(
        !this.initData?.nestado
          ? 1
          : this.initData?.nestado === "Activo"
          ? 1
          : 0
      ),
    });

    this.setCliente();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setCliente(): void {
    this.maestServ
      .getList({ tipo: 1, pageSize: 999 })
      .subscribe((resp: any) => {
        this.clienteOptions = resp.body.data;

        if (!this.isEdit) {
          this.clienteOptions = resp.body.data.filter(
            (x) => x.nestado === "Activo"
          );
        }
      });
  }

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
