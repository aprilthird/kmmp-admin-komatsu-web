import { Component, Inject, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { forkJoin, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ClientI } from "../../clientes/client-model";
import { FlotasService } from "../../flotas/flotas.service";
import { MaestrosService } from "../../maestros.service";

//MODELS
import { EquipoI } from "../equipo-model";

//SERVICES
import { EquiposService } from "../equipos.service";
import { ModelosService } from "../../modelos/modelos.service";
import { ModeloI } from "../../modelos/modelo-model";
import { Response } from "app/shared/models/general-model";

@Component({
  selector: "app-dialog-add-equipos",
  templateUrl: "./dialog-add-equipos.component.html",
  styleUrls: ["./dialog-add-equipos.component.scss"],
})
export class DialogAddEquiposComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  initData: EquipoI;
  isEdit: boolean;
  equipoId: number;
  isLoading: boolean;
  cliente: string;
  horometro: string;
  clientesData: any;
  modelosData: any;
  flotasData: any;
  tipo_equipos: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private equiposService: EquiposService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddEquiposComponent>,
    private maestServ: MaestrosService,
    private modelosService: ModelosService
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.equipoId = this.data.id;
    }
    this.getSelectsData();
    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, Validators.required),
      tag: new FormControl(this.initData?.tag, Validators.required),
      idTipoEquipo: new FormControl(
        this.initData?.idTipoEquipo,
        Validators.required
      ),

      idModelo: new FormControl(this.initData?.idModelo, Validators.required),
      idFlota: new FormControl(this.initData?.idFlota, Validators.required),
      idCliente: new FormControl(this.initData?.idCliente, Validators.required),
      modelo: new FormControl(this.initData?.modelo),
      cliente: new FormControl(this.initData?.cliente),
      horometro: new FormControl(this.initData?.horometro),
      estado: new FormControl(
        !this.initData?.nestado
          ? 1
          : this.initData?.nestado === "Activo"
          ? 1
          : 0
      ),
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getSelectsData(): void {
    this.isLoading = true;
    const cli = this.maestServ.getList(1).pipe(map((x: any) => x.body.data));
    const mod = this.maestServ.getList(5).pipe(map((x: any) => x.body.data));
    const flt = this.maestServ.getList(6).pipe(map((x: any) => x.body.data));
    const t_e = this.maestServ.getList(3).pipe(map((x: any) => x.body.data));

    forkJoin([cli, mod, flt, t_e]).subscribe(async (resp) => {
      this.clientesData = await resp[0];
      this.modelosData = await resp[1];
      this.tipo_equipos = await resp[3];
      this.isLoading = false;

      if (this.isEdit) {
        this.clientSelected(this.initData?.idCliente);
      }
    });
  }

  submit(isEdit): void {
    //this.form.controls["cliente"].enable();
    this.form.controls["modelo"].setValue(
      this.setModeloName(Number(this.form.controls["idModelo"].value))
    );
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.equipoId));
    }

    this.equiposService.postEquipo(this.form.value).subscribe((resp) => {
      setTimeout(() => {
        this.isLoading = false;
        this.matdialigRef.close();
      }, 1000);
    });
  }

  private setDinamycData(): void {
    const currentClient = this.flotasData.find(
      (x: any) => x.nombre === this.initData.flota
    );

    this.form.controls["cliente"].setValue(currentClient.cliente);
    //this.setClientId();
    this.setModelotId();
  }

  /*private setInitModelo(nombre: string): void {
    this.form.controls["idModelo"].setValue(
      this.modelosData.find((x: any) => nombre === x.nombre).id
    );
  }*/

  private setClientId(): void {
    this.form.controls["cliente"].enable();
    setTimeout(() => {
      this.maestServ.getClients().subscribe((resp: any) => {
        const test = resp.body.data;
        const currentClient = test.find(
          (x: ClientI) => x.nombre === this.form.controls["cliente"].value
        );
        this.form.controls["idCliente"].setValue(currentClient.id);
      });
      this.form.controls["cliente"].disable();
    });
  }

  private setModelotId(): void {
    setTimeout(() => {
      this.modelosService.getModelos().subscribe((resp: any) => {
        const test = resp.body.data;
        const currentModel = test.find(
          (x: ModeloI) => x.nombre === this.form.controls["modelo"].value
        );
        this.form.controls["idModelo"].setValue(currentModel.id);
      });
    });
  }

  check(event): void {
    setTimeout(() => {
      this.form.controls["estado"].setValue(event.checked ? 1 : 0);
    }, 200);
  }

  private setModeloName(id: number): string {
    return this.modelosData.find((x: any) => x.id === id).nombre;
  }

  flotaSelected(e: any): void {
    const currentClient = this.flotasData.find((x: any) => x.id === e.value);

    this.form.controls["cliente"].setValue(currentClient.cliente);
    this.form.controls["idCliente"].setValue(currentClient.id);
  }

  clientSelected(idCliente: number): void {
    this.maestServ.getList(6, idCliente).subscribe((resp: any) => {
      this.flotasData = resp.body.data;
    });
    this.form.controls.cliente.setValue(
      this.clientesData.find((x) => x.id === idCliente).nombre
    );
  }

  setModelo(event: MatSelectChange): void {
    this.form.controls["modelo"].setValue(
      this.modelosData.find((x: any) => event.value === x.id).nombre
    );
  }
}
