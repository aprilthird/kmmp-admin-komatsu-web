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

@Component({
  selector: "activity-add-edit",
  templateUrl: "./activity-add-edit.component.html",
  styleUrls: ["./activity-add-edit.component.scss"],
})
export class ActivityAddEditComponent implements OnInit {
  service_orders = ServiceOrders;
  pe_items = PE;
  isEdit: boolean;
  idActivity: number;
  isLoading: boolean = true;
  loadLoading: boolean;
  form: FormGroup = this.fb.group({});
  clientsOpt: any[];
  equiposOpt: any[];
  bahiasOpt: any[];
  clase_actividadesOpt: any[];
  modelosOpt: any[];
  tipo_equiposOpt: any[];
  flotasOpt: any[];
  tipo_mttoOpt: any[];
  activityInfo: any;
  tipo_solicitudes: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceAct: ActivitiesService,
    private equiposService: EquiposService,
    private _fuseConfirmationService: FuseConfirmationService
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
      setTimeout(() => {
        this.getEquiposData(this.activityInfo.idEquipo);
      }, 1500);
    });
  }

  getEquiposData(id: number): void {
    this.equiposService.getEquipos({ id: id }).subscribe((resp) => {
      const currentEquipo = resp.body.data.find((x: any) => x.id === id);
      this.form.controls["modelo"].setValue(currentEquipo.modelo);
      this.form.controls["flota"].setValue(currentEquipo.flota);
      this.form.controls["tipo_equipo"].setValue(currentEquipo.tipoEquipo);
      this.form.controls["idModelo"].setValue(currentEquipo.idModelo);
      this.form.controls["idFlota"].setValue(currentEquipo.idFlota);
      this.form.controls["idTipoEquipo"].setValue(currentEquipo.idTipoEquipo);
    });

    this.form.controls["modelo"].disable();
    this.form.controls["flota"].disable();
    this.form.controls["tipo_equipo"].disable();
  }

  private setActivityData(): void {
    this.form = this.fb.group({
      cliente: new FormControl(
        this.activityInfo?.idCliente,
        Validators.required
      ),
      equipo: new FormControl(this.activityInfo?.idEquipo, Validators.required),
      modelo: new FormControl(),
      flota: new FormControl(),
      idFlota: new FormControl(),
      idModelo: new FormControl(),
      tipo_equipo: new FormControl(),
      actividad: new FormControl(
        this.activityInfo?.idClaseActividad,
        Validators.required
      ),
      idEquipo: new FormControl(),
      idTipoEquipo: new FormControl(),
      tipo_mantenimiento: new FormControl(
        this.activityInfo?.idTipoMantenimiento,
        Validators.required
      ),
      bahia_asignada: new FormControl(
        this.activityInfo?.idBahia,
        Validators.required
      ),
      tipo_solicitud: new FormControl(
        this.activityInfo?.idTipoSolicitud,
        Validators.required
      ),
      descripcion_actividad: new FormControl(this.activityInfo?.descripcion),
      numero_bl: new FormControl(this.activityInfo?.nbl),
      os: new FormControl(this.activityInfo?.nos),
      pe: new FormControl(this.activityInfo?.npe),
      fechaEstimadaIni: new FormControl(),
      duracion: new FormControl(this.activityInfo?.duracion),
      fecha_real_inicio: new FormControl(),
      fecha_real_fin: new FormControl(),
      duracion_2: new FormControl(this.activityInfo?.duracionReal),
      comentarios_tecnico: new FormControl(
        this.activityInfo?.comentariosTecnico
      ),
    });
    setTimeout(() => {
      if (this.isEdit) this.disableFormControl();
    }, 2000);
  }

  private disableFormControl(): void {
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== "descripcion_actividad") this.form.controls[key].disable();
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
      (result: any) => {
        this.clientsOpt = result[0];
        this.equiposOpt = result[1];
        this.clase_actividadesOpt = result[2];
        this.bahiasOpt = result[3];
        this.modelosOpt = result[4];
        this.flotasOpt = result[5];
        this.tipo_equiposOpt = result[6];
        this.isLoading = false;

        this.setActivityData();
      }
    );
  }

  getTipoMtto(idClaseActividad): void {
    this.serviceAct.getTipoMtto(9, idClaseActividad).subscribe((resp: any) => {
      console.log(resp);
      this.tipo_mttoOpt = resp.body.data;
    });
  }

  private getTipoSolicitud(): void {
    this.serviceAct.getResources(7).subscribe((resp) => {
      this.tipo_solicitudes = resp.body;
    });
  }

  addSingleActivity(): void {
    this.loadLoading = true;
    this.serviceAct
      .postCargaIndividual(this.getParams())
      .subscribe((resp: any) => {
        this.loadLoading = false;
        if (resp.code >= 500) {
          const dialogRef = this._fuseConfirmationService.open({
            title: "Carga de actividad",
            message: resp.message,
            icon: {
              name: "mat_outline:error_outline",
              color: "primary",
            },
            actions: {
              cancel: {
                label: "Ok",
              },
            },
            dismissible: true,
          });
          dialogRef.beforeClosed().subscribe(() => {});
        }

        this.router.navigate(["/admin/actividades/list"]);
      });
  }

  removeOS(index: number): void {
    this.service_orders.splice(index, 1);
    console.log("");
  }

  addOS(): void {
    if (this.service_orders.length === 1) {
      this.service_orders.push({
        id: this.service_orders.length + 1,
        value: "",
      });
    }
  }

  removePE(index: number): void {
    this.pe_items.splice(index, 1);
  }

  addPE(): void {
    if (this.pe_items.length === 1) {
      this.pe_items.push({
        id: this.pe_items.length + 1,
        value: "",
      });
    }
  }

  saveActivity(): void {
    this.loadLoading = true;
    this.serviceAct.postCargaIndividual(this.getParams()).subscribe((resp) => {
      console.log("resp post activity ", resp);
      this.loadLoading = false;
      this.router.navigate(["/admin/actividades/list"]);
    });
  }

  private getParams(): any {
    const params: ActivityI = {
      cliente: JSON.stringify(this.form.controls["cliente"].value),
      idEquipo: this.form.controls["equipo"].value,
      flota: this.form.controls["flota"].value,
      idFlota: Number(this.form.controls["idFlota"].value),
      idTipoEquipo: this.form.controls["idTipoEquipo"].value,
      tipo_equipo: this.form.controls["tipo_equipo"].value,
      idTipoMantenimiento: this.form.controls["tipo_mantenimiento"].value,
      idBahia: this.form.controls["bahia_asignada"].value,
      idTipoSolicitud: this.form.controls["tipo_solicitud"].value,
      descripcion: this.form.controls["descripcion_actividad"].value,
      nbl: this.form.controls["numero_bl"].value,
      nos: "xxx",
      npe: "yyy",
      idCliente: this.form.controls["cliente"].value,
      idClaseActividad: this.form.controls["actividad"].value,
      idModelo: this.form.controls["idModelo"].value,
      visible: true,
      activo: true,
      actividad: "actividad",
      nombre: "nombre",
      fechaEstimadaIni: this.form.controls["fechaEstimadaIni"].value,
      id: 0,
    };
    if (this.isEdit) {
      params["id"] = this.idActivity;
    } else {
      params["id"] = 0;
    }

    return params;
  }
}

const ServiceOrders = [
  {
    id: 1,
    value: "876HGJGU7G",
  },
];

const PE = [
  {
    id: 1,
    value: "DSD8S9F797",
  },
];
