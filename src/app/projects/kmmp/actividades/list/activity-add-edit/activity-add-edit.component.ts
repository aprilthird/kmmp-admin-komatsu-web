import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Activity,
  Asignaciones,
} from "app/projects/kmmp/fake-db/activities/activity-fake-db";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

//SERVICES
import { ActivitiesService } from "../../activities.service";

@Component({
  selector: "activity-add-edit",
  templateUrl: "./activity-add-edit.component.html",
  styleUrls: ["./activity-add-edit.component.scss"],
})
export class ActivityAddEditComponent implements OnInit {
  service_orders = ServiceOrders;
  pe_items = PE;
  isEdit: boolean;
  idActivity: any;
  tipo_mantenimientos = tipo_mantenimientos;
  tipo_solicitudes = tipo_solicitudes;

  form: FormGroup = this.fb.group({
    cliente: new FormControl(""),
    equipo: new FormControl(""),
    modelo: new FormControl(""),
    flota: new FormControl(""),
    tipo_equipo: new FormControl(""),
    actividad: new FormControl(""),
    tipo_mantenimiento: new FormControl(""),
    bahia_asignada: new FormControl(""),
    tipo_solicitud: new FormControl(""),
    descripcion_actividad: new FormControl(""),
    numero_bl: new FormControl(""),
    /*os: new FormControl(""),
    pe: new FormControl(""),*/
    fecha_estimada: new FormControl(""),
    duracion: new FormControl(""),
    fecha_real_inicio: new FormControl(""),
    fecha_real_fin: new FormControl(""),
    duracion_2: new FormControl(""),
    comentarios_tecnico: new FormControl(""),
  });
  clientsOpt: any[];
  equiposOpt: any[];
  bahiasOpt: any[];
  clase_actividadesOpt: any[];
  modelosOpt: any[];
  tipo_equiposOpt: any[];
  flotasOpt: any[];
  tipo_mttoOpt: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceAct: ActivitiesService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getInboxes();
  }

  getInboxes(): void {
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
      }
    );
  }

  getTipoMtto(idClaseActividad): void {
    this.serviceAct.getTipoMtto(8, idClaseActividad).subscribe((resp: any) => {
      console.log(resp);
      this.tipo_mttoOpt = resp.body.data;
    });
  }

  private getData(): void {
    this.activatedRoute.paramMap.forEach((param: any) => {
      if (param.params.id) {
        this.idActivity = param.params.id;
        this.isEdit = true;

        const currentActivity = Asignaciones.find(
          (x: Activity) => x.id === Number(this.idActivity)
        );

        Object.keys(this.form.value).forEach((x) => {
          console.log(this.form.value);
          this.form.controls[x].setValue(currentActivity[x]);
        });
      }
    });
  }

  removeOS(index: number): void {
    this.service_orders.splice(index, 1);
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
    this.router.navigate(["/admin/actividades/list"]);
  }

  createActivity(): void {
    this.serviceAct.addNewActivity({
      id: Asignaciones.length,
      estado: "Sin empezar",
      ...this.form.value,
    });

    this.router.navigate(["/admin/actividades/list"]);
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

const tipo_mantenimientos = [
  {
    id: 1,
    name: "PS01",
  },
  {
    id: 2,
    name: "PS02",
  },
];

const tipo_solicitudes = [
  {
    id: 1,
    name: "Plan",
  },
];
