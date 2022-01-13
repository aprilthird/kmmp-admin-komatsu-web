import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { ActivitiesService } from "app/projects/kmmp/actividades/activities.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DispositivosService } from "../dispositivos.service";

@Component({
  selector: "app-dialog-add-dispositivos",
  templateUrl: "./dialog-add-dispositivos.component.html",
  styleUrls: ["./dialog-add-dispositivos.component.scss"],
})
export class DialogAddDispositivosComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  bays = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dispositivoService: DispositivosService,
    private fb: FormBuilder,
    private serviceAct: ActivitiesService,
    public matdialigRef: MatDialogRef<DialogAddDispositivosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: new FormControl(data?.nombre, Validators.required),
      fecha_creacion: new FormControl(data?.fechaReg, Validators.required),
      idBahia: new FormControl(data?.idBahia, Validators.required),
      idDispositivo: new FormControl(data?.id),
      id: new FormControl(data?.idDispositivoBahia),
    });
  }

  ngOnInit(): void {
    this.getBays();
    this.form.controls["nombre"].disable();
    this.form.controls["fecha_creacion"].disable();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  baySelection(event: MatSelectChange): void {
    event.value.forEach((valueSelected) => {
      const selectet = this.bays.find((bay) => bay.idBahia === valueSelected);
      const payload = {
        idBahia: selectet.idBahia,
        idDispositivo: this.data.id,
        nombre: "",
        id: selectet.idDispositivoBahia,
      };

      this.dispositivoService
        .assignDeviceToBay(payload)
        .subscribe((resp) => {});
    });
  }

  getBays(): void {
    this.serviceAct
      .getBaysByDevice(this.data.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resp) => {
        this.bays = resp.body;
      });
  }

  submit(): void {
    this.form.controls["fecha_creacion"].enable();
    this.form.controls["nombre"].enable();
    this.dispositivoService
      .assignDeviceToBay(this.form.value)
      .subscribe((resp) => {
        this.matdialigRef.close();
      });
  }
}
