import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { forkJoin, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ActivitiesService } from "../../activities.service";
import { EquiposService } from "app/projects/kmmp/maestros/equipos/equipos.service";
import { Activity as ActivityI } from "./../../models/activities-model";
import {
  getValues,
  setEquiposData,
} from "app/shared/utils/read-load-arrayValues";
import { TipoFormulario } from "app/shared/models/form-activity";
import { MatDialog } from "@angular/material/dialog";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { Response } from "app/shared/models/general-model";
import { BayI } from "../../models/bays-model";
import moment from "moment";

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
  currentDevice: number;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceAct: ActivitiesService,
    private equiposService: EquiposService,
    private matDialog: MatDialog
  ) {
    this.setActivityData();
    this.getActivityId();
  }

  ngOnInit(): void {
    this.getInboxes();
    this.getTipoSolicitud();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
    let t_e = this.serviceAct.getList(3).pipe(map((x: any) => x.body.data));
    let bahias = this.serviceAct.getList(4).pipe(map((x: any) => x.body.data));
    let modelos = this.serviceAct.getList(5).pipe(map((x: any) => x.body.data));
    let flotas = this.serviceAct.getList(6).pipe(map((x: any) => x.body.data));
    let c_act = this.serviceAct.getList(7).pipe(map((x: any) => x.body.data));

    forkJoin([clients, c_act, bahias, modelos, flotas, t_e]).subscribe(
      (result) => {
        this.clientsOpt = result[0];
        this.clase_actividadesOpt = result[1];
        this.bahiasOpt = result[2];
        this.modelosOpt = result[3];
        this.flotasOpt = result[4];
        this.tipo_equiposOpt = result[5];
        this.isLoading = false;
        this.setEmptyBay();
      }
    );
  }

  getTipoMtto(idClaseActividad, e?): void {
    this.serviceAct.getTipoMtto(9, idClaseActividad).subscribe((resp: any) => {
      this.tipo_mttoOpt = resp.body.data;
    });
    if (e) {
      this.form.controls.tipo_mantenimiento.setValue("");
    }
  }

  private getTipoSolicitud(): void {
    this.serviceAct.getResources(7).subscribe((resp) => {
      this.tipo_solicitudes = resp.body;
    });
  }

  getEquiposData(id: number): void {
    this.equiposService
      .getEquipos({ id: id, pageSize: 999 })
      .subscribe(async (resp) => {
        const currentEquipo = await resp.body.data.find(
          (x: any) => x.id === id
        );
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
      duracion: new FormControl(this.activityInfo?.duracion),
      fechaHoraIniReal: new FormControl(this.activityInfo?.fechaHoraIniReal),
      fechaHoraFinReal: new FormControl(this.activityInfo?.fechaHoraFinReal),
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

    if (this.isEdit) {
      this.form.addControl(
        "fechaEstimadaIni",
        new FormControl(this.activityInfo?.fechaEstimadaIni)
      );
      this.form.addControl(
        "fechaEstimadaFin",
        new FormControl(this.activityInfo?.fechaEstimadaFin)
      );
    }

    this.form.controls.duracion.setValue(
      this.getTimeDiff(
        this.activityInfo?.fechaEstimadaIni,
        this.activityInfo?.fechaEstimadaFin
      )
    );

    this.form.controls.duracionReal.setValue(
      this.getTimeDiff(
        this.activityInfo?.fechaHoraIniReal,
        this.activityInfo?.fechaHoraFinReal
      )
    );

    if (
      this.form.controls.actividad.value &&
      this.form.controls.actividad.value !== null &&
      this.isEdit
    ) {
      this.getTipoMttoName();
    }

    if (this.isEdit) {
      this.form.controls["numero_bl"].disable();
      this.form.controls["fechaHoraIniReal"].disable();
      this.form.controls["fechaHoraFinReal"].disable();
      this.form.controls["duracionReal"].disable();
      this.form.controls["duracion"].disable();
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
      // fechaEstimadaFin: this.form.controls["fechaEstimadaFin"].value,
      // fechaEstimadaIni: this.form.controls["fechaEstimadaIni"].value,

      fechaHoraFinReal: this.form.controls["fechaHoraFinReal"].value
        ? this.form.controls["fechaHoraFinReal"].value
        : moment().format("yyyy-MM-DD"),
      fechaHoraIniReal: this.form.controls["fechaHoraIniReal"].value
        ? this.form.controls["fechaHoraIniReal"].value
        : moment().subtract(3, "years").format("yyyy-MM-DD"),

      duracion: this.form.controls["duracion"].value,
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
      params["fechaEstimadaFin"] = this.form.controls["fechaEstimadaFin"].value
        ? this.form.controls["fechaEstimadaFin"].value
        : moment().format("yyyy-MM-DD");
      params["fechaEstimadaIni"] = this.form.controls["fechaEstimadaIni"].value
        ? this.form.controls["fechaEstimadaIni"].value
        : moment().subtract(3, "years").format("yyyy-MM-DD");
    } else {
      params["id"] = 0;
    }
    return params;
  }

  private setEmptyBay(): void {
    this.bahiasOpt.unshift({
      id: null,
      nombre: "----NINGUNA----",
    });
  }

  private getTipoMttoName(): void {
    this.getTipoMtto(this.form.controls.actividad.value);
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

  setBay(clientId: number) {
    let bays: BayI[] = [];
    this.serviceAct.getList(4).subscribe((resp) => {
      bays = resp.body.data;
      this.bahiasOpt = bays.filter((bay) => bay.idCliente === clientId);
      this.setEmptyBay();
    });
    this.serviceAct.getList(2, clientId).subscribe((resp) => {
      this.equiposOpt = resp.body.data;
      this.form.controls.idEquipo.setValue(null);
    });
  }

  getTimeDiff(dateIni, dateFin): number {
    return Math.abs(
      (new Date(dateIni).getTime() - new Date(dateFin).getTime()) / 3600000
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
  dateChange(): void {
    setTimeout(() => {
      this.form.controls.duracion.setValue(
        this.getTimeDiff(
          this.form.controls.fechaEstimadaIni.value,
          this.form.controls.fechaEstimadaFin.value
        )
      );
    }, 250);
  }
}
