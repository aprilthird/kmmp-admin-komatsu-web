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
  baysAssigned: any[] = [];

  constructor(
    private dispositivoService: DispositivosService,
    private fb: FormBuilder,
    private serviceAct: ActivitiesService,
    public matdialigRef: MatDialogRef<DialogAddDispositivosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: new FormControl(data?.usuario, Validators.required),
      fecha_creacion: new FormControl(data?.fechaReg, Validators.required),
      idBahia: new FormControl(),
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
    let el: number;
    let active: boolean;
    event.value.forEach((valueSelected: number) => {
      this.baysAssigned.filter((x: any) => {
        if (x !== valueSelected) {
          active = false;
          el = x;
        }
      });
    });

    if (this.baysAssigned.length < event.value.length) {
      active = true;
      el = event.value.find((x) => !this.baysAssigned.includes(x));
    }

    if (event.value.length === 0) {
      active = false;
      el = this.baysAssigned[0];
    }
    const selectet = this.bays.find((bay) => bay.idBahia === el);
    const payload = {
      idBahia: selectet.idBahia,
      idDispositivo: this.data.id,
      nombre: "",
      id: selectet.idDispositivoBahia,
      activo: active,
    };
    this.dispositivoService.assignDeviceToBay(payload).subscribe(() => {
      this.matdialigRef.close();
    });
  }

  getBays(): void {
    this.serviceAct
      .getBaysByDevice(this.data.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resp) => {
        this.bays = resp.body;
        this.form.controls.idBahia.patchValue([
          ...this.bays.map((bay) => {
            if (bay.idDispositivoBahia > 0 && bay.activo) return bay.idBahia;
          }),
        ]);
        this.baysAssigned = this.bays
          .filter((bay) => {
            if (bay.idDispositivoBahia > 0 && bay.activo) return bay.idBahia;
          })
          .map((x) => x.idBahia);
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
