import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivitiesService } from "app/projects/kmmp/actividades/activities.service";
import { Observable, Subject } from "rxjs";
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
  bays$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dispositivoService: DispositivosService,
    private fb: FormBuilder,
    private serviceAct: ActivitiesService,
    public matdialigRef: MatDialogRef<DialogAddDispositivosComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.form = this.fb.group({
      dispositivo: new FormControl(data?.usuario, Validators.required),
      fecha_creacion: new FormControl(data?.fechaReg, Validators.required),
      bahia_asignada: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.getBays();
    this.form.controls["dispositivo"].disable();
    this.form.controls["fecha_creacion"].disable();
  }

  getBays(): void {
    this.bays$ = this.serviceAct
      .getList(4)
      .pipe(takeUntil(this._unsubscribeAll));
  }

  submit(): void {
    this.form.controls["fecha_creacion"].enable();
    this.form.controls["dispositivo"].enable();
    this.dispositivoService
      .assignDeviceToBay(this.form.value)
      .subscribe((resp) => {
        this.matdialigRef.close();
      });
  }
}
