import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

//SERVICES
import { ActivitiesService } from "../../activities.service";
import { EquiposService } from "app/projects/kmmp/maestros/equipos/equipos.service";
//MODELS
import { Activity as ActivityI } from "./../../models/activities-model";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import {
  getValues,
  setEquiposData,
} from "app/shared/utils/read-load-arrayValues";
import { TipoFormulario } from "app/shared/models/form-activity";
import { MatDialog } from "@angular/material/dialog";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { Response } from "app/shared/models/general-model";
import { BayI } from "../../models/bays-model";

@Component({
  selector: "activity-add-edit",
  templateUrl: "./activity-add-edit.component.html",
  styleUrls: ["./activity-add-edit.component.scss"],
})
export class ActivityAddEditComponent implements OnInit {
  service_orders = [""];
  pe_items = [""];
  isEdit: boolean;
  idActivity: number;
  isLoading: boolean = true;
  loadLoading: boolean;
  form: FormGroup = this.fb.group({});
  formPE: FormGroup = this.fb.group({});
  formOS: FormGroup = this.fb.group({});

  activityInfo: ActivityI;
  clientsOpt = [];
  equiposOpt = [];
  bahiasOpt = [];
  clase_actividadesOpt = [];
  modelosOpt = [];
  tipo_equiposOpt = [];
  flotasOpt = [];
  tipo_mttoOpt = [];
  tipo_solicitudes = [];
  currentTypeMtto: number;
  currentDevice: number;
  enableTipoMtto: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceAct: ActivitiesService,
    private equiposService: EquiposService,
    private _fuseConfirmationService: FuseConfirmationService,
    private matDialog: MatDialog
  ) {
    this.setActivityData();
    this.getActivityId();
  }

  ngOnInit(): void {
    this.getInboxes();
    this.getTipoSolicitud();
  }

  private getActivityId() {
    this.activatedRoute.paramMap.subscribe((resp: any) => {
      if (resp.params.id) {
        this.isEdit = true;
        this.idActivity = Number(resp.params.id);
        this.getActivityData(this.idActivity);
      }
    });
  }

  private getActivityData(id: number) {
    this.serviceAct.getActivity(id).subscribe((resp: any) => {
      this.activityInfo = resp.body;
      this.getEquiposData(resp.body.idEquipo);
      if (this.isEdit) {
        this.setActivityData();
        setTimeout(() => {
          this.serviceAct
            .getList(2, this.activityInfo.idCliente)
            .subscribe((resp) => {
              this.equiposOpt = resp.body.data;

              this.form.controls.cliente.setValue(this.activityInfo.idCliente);
              setTimeout(() => {
                this.form.controls.idEquipo.setValue(
                  this.activityInfo.idEquipo
                );
              }, 250);
            });
        }, 1000);
      }
    });
  }

  private getInboxes(): void {
    let clients = this.serviceAct.getList(1).pipe(map((x: any) => x.body.data));
    let equipos = this.serviceAct.getList(2).pipe(map((x: any) => x.body.data));
    let t_e = this.serviceAct.getList(3).pipe(map((x: any) => x.body.data));
    let bahias = this.serviceAct.getList(4).pipe(map((x: any) => x.body.data));
    let modelos = this.serviceAct.getList(5).pipe(map((x: any) => x.body.data));
    let flotas = this.serviceAct.getList(6).pipe(map((x: any) => x.body.data));
    let c_act = this.serviceAct.getList(7).pipe(map((x: any) => x.body.data));

    forkJoin([clients, equipos, c_act, bahias, modelos, flotas, t_e]).subscribe(
      (result) => {
        this.clientsOpt = result[0];
        //this.equiposOpt = result[1];
        this.clase_actividadesOpt = result[2];
        //this.bahiasOpt = result[3];
        this.modelosOpt = result[4];
        this.flotasOpt = result[5];
        this.tipo_equiposOpt = result[6];
        this.isLoading = false;

        //this.setActivityData();
        this.bahiasOpt.unshift({
          id: null,
          nombre: "----NINGUNA----",
        });
      }
    );
  }

  getTipoMtto(idClaseActividad): void {
    this.serviceAct.getTipoMtto(9, idClaseActividad).subscribe((resp: any) => {
      this.tipo_mttoOpt = resp.body.data;
      this.enableTipoMtto = true;
      this.form.controls["tipo_mantenimiento"].enable();
    });
  }

  private getTipoSolicitud(): void {
    this.serviceAct.getResources(7).subscribe((resp) => {
      this.tipo_solicitudes = resp.body;
    });
  }

  addSingleActivity(): void {
    this.loadLoading = true;
    this.serviceAct.postCargaIndividual(this.getParams()).subscribe(
      (resp: any) => {
        this.loadLoading = false;
        if (resp.code >= 500) {
          this.matDialog.open(UiDialogsComponent, {
            data: { title: "Error", message: resp.message },
          });
        }

        this.router.navigate(["/admin/actividades/list"]);
      },
      (err) => {
        this.matDialog.open(UiDialogsComponent, {
          data: { title: "Error", message: err.message },
        });
      }
    );
  }

  removeOS(index: number): void {
    this.service_orders.splice(index, 1);
    this.formOS.removeControl("1");
  }

  addOS(): void {
    if (this.service_orders.length === 1) {
      this.formOS.addControl("1", new FormControl());
      this.service_orders.push("");
    }
  }

  removePE(index: number): void {
    this.pe_items.splice(index, 1);
    this.formPE.removeControl("1");
  }

  addPE(): void {
    if (this.pe_items.length === 1) {
      this.formPE.addControl("1", new FormControl());
      this.pe_items.push("");
    }
  }

  saveActivity(): void {
    this.loadLoading = true;
    this.serviceAct.postCargaIndividual(this.getParams()).subscribe(
      (resp: Response) => {
        if (!resp.success) {
          this.matDialog
            .open(UiDialogsComponent, {
              data: {
                title: "Error",
                message: resp.message
                  ? resp.message
                  : "Actividad ya está en proceso, no es posible editar dichos valores",
              },
              width: "450px",
            })
            .afterClosed()
            .subscribe(() => {
              this.loadLoading = false;
              this.router.navigate(["/admin/actividades/list"]);
            });
        } else {
          this.loadLoading = false;
          this.router.navigate(["/admin/actividades/list"]);
        }
      },
      (err) => {
        this.matDialog
          .open(UiDialogsComponent, {
            data: {
              title: "Error",
              message: err.message
                ? err.message
                : "Actividad ya está en proceso, no es posible editar dichos valores",
            },
            width: "450px",
          })
          .afterClosed()
          .subscribe(() => (this.loadLoading = false));
      }
    );
  }

  getEquiposData(id: number): void {
    this.equiposService.getEquipos({ id: id }).subscribe(async (resp) => {
      const currentEquipo = await resp.body.data.find((x: any) => x.id === id);
      if (currentEquipo) {
        this.currentDevice = id;
        setEquiposData(this.form, currentEquipo);
      } else {
        this.matDialog
          .open(UiDialogsComponent, {
            data: { title: "Error", message: "Equipo inválido" },
            width: "450px",
          })
          .afterClosed()
          .subscribe(() =>
            this.form.controls["idEquipo"].setValue(this.currentDevice)
          );
      }
    });
  }

  private disableFormControl(): void {
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== TipoFormulario.DESCRIPCION) this.form.controls[key].disable();
    });
  }

  private setDynamicFormFromString(type: string): void {
    let form: FormGroup;
    if (type === TipoFormulario.NOS) form = this.formOS;
    else form = this.formPE;

    form.addControl("0", new FormControl());
    if (this.isEdit) form.controls["0"].disable();
    if (this.activityInfo?.[type]) {
      form.controls["0"].setValue(this.activityInfo?.[type].split(",")[0]);
      if (this.activityInfo?.[type].split(",")[1]) {
        form.addControl(
          "1",
          new FormControl(this.activityInfo?.[type].split(",")[1])
        );
        if (this.isEdit) form.controls["1"].disable();
        if (type === TipoFormulario.NOS) this.service_orders.push("");
        else this.pe_items.push("");
      }
    }
  }

  setBay(clientId: number) {
    let bays: BayI[] = [];
    this.serviceAct.getList(4).subscribe((resp) => {
      bays = resp.body.data;
      this.bahiasOpt = bays.filter((bay) => bay.idCliente === clientId);
      this.bahiasOpt.unshift({
        id: null,
        nombre: "----NINGUNA----",
      });
    });
    this.serviceAct.getList(2, clientId).subscribe((resp) => {
      this.equiposOpt = resp.body.data;
      this.form.controls.idEquipo.setValue(null);
    });
  }

  private setActivityData(): void {
    this.setDynamicFormFromString(TipoFormulario.NOS);
    this.setDynamicFormFromString(TipoFormulario.NPE);
    this.form = this.fb.group({
      cliente: new FormControl(
        this.activityInfo?.idCliente,
        Validators.required
      ),
      actividad: new FormControl(
        this.activityInfo?.idClaseActividad,
        Validators.required
      ),
      idEquipo: new FormControl(
        this.activityInfo?.idEquipo,
        Validators.required
      ),
      idTipoEquipo: new FormControl(),
      tipo_mantenimiento: new FormControl(
        this.activityInfo?.idTipoMantenimiento,
        Validators.required
      ),
      bahia_asignada: new FormControl(this.activityInfo?.idBahia),
      tipo_solicitud: new FormControl(
        this.activityInfo?.idTipoSolicitud,
        Validators.required
      ),
      descripcion_actividad: new FormControl(this.activityInfo?.descripcion),
      numero_bl: new FormControl(this.activityInfo?.nbl),
      os: new FormControl(this.activityInfo?.nos),
      pe: new FormControl(this.activityInfo?.npe),
      fechaEstimadaFin: new FormControl(this.activityInfo?.fechaEstimadaFin),
      duracion: new FormControl(this.getTimeDiff()),
      fechaRealIni: new FormControl(this.activityInfo?.fechaHoraIniReal),
      fechaRealFin: new FormControl(this.activityInfo?.fechaHoraFinReal),
      duracionReal: new FormControl(this.activityInfo?.duracionReal),
      comentariosTecnico: new FormControl(
        this.activityInfo?.comentariosTecnico
      ),
      modelo: new FormControl(),
      flota: new FormControl(),
      idFlota: new FormControl(),
      idModelo: new FormControl(),
      tipo_equipo: new FormControl(),
    });
    this.form.controls["tipo_mantenimiento"].disable();

    if (this.isEdit) {
      this.form.controls["numero_bl"].disable();
      this.form.controls["fechaEstimadaFin"].disable();
      this.form.controls["duracion"].disable();
      this.form.controls["fechaRealIni"].disable();
      this.form.controls["fechaRealFin"].disable();
      this.form.controls["duracionReal"].disable();
      this.form.controls["comentariosTecnico"].disable();
    }
  }

  private getParams(): ActivityI {
    const params: ActivityI = {
      asignado: this.form.controls["bahia_asignada"].value ? true : false,
      cliente: JSON.stringify(this.form.controls["cliente"].value),
      idEquipo: this.form.controls["idEquipo"].value,
      flota: this.form.controls["flota"].value,
      idFlota: Number(this.form.controls["idFlota"].value),
      idTipoEquipo: this.form.controls["idTipoEquipo"].value,
      tipo_equipo: this.form.controls["tipo_equipo"].value,
      idTipoMantenimiento: this.form.controls["tipo_mantenimiento"].value,
      idBahia: this.form.controls["bahia_asignada"].value,
      idTipoSolicitud: this.form.controls["tipo_solicitud"].value,
      descripcion: this.form.controls["descripcion_actividad"].value,
      nbl: this.form.controls["numero_bl"].value,
      nos: getValues(this.formOS),
      npe: getValues(this.formPE),
      idCliente: this.form.controls["cliente"].value,
      idClaseActividad: this.form.controls["actividad"].value,
      idModelo: this.form.controls["idModelo"].value,
      visible: true,
      activo: true,
      actividad: "actividad",
      nombre: "nombre",
      id: 0,
    };
    if (this.isEdit) {
      params["id"] = this.idActivity;
    } else {
      params["id"] = 0;
    }
    return params;
  }

  getTimeDiff(): number {
    return Math.abs(
      (new Date(this.activityInfo?.fechaHoraFinReal).getTime() -
        new Date(this.activityInfo?.fechaHoraIniReal).getTime()) /
        3600000
    );
  }
}
