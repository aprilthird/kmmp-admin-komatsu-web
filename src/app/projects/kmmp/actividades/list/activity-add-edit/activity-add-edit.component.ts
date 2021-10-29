import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Activity,
  Asignaciones,
} from "app/projects/kmmp/fake-db/activities/activity-fake-db";

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
  clientes = clientes;
  equipos = equipos;
  modelos = modelos;
  tipo_mantenimientos = tipo_mantenimientos;
  bahias_asignadas = bahias_asignadas;
  flotas = flotas;
  tipo_equipos = tipo_equipos;
  actividades = actividades;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
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
    Asignaciones.push({
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

const clientes = [
  {
    id: 1,
    name: "Juan Pérez",
  },
  {
    id: 2,
    name: "Oscar Ramírez",
  },
];

const equipos = [
  {
    id: 1,
    name: "Pala hidráulica",
  },
  {
    id: 2,
    name: "Rastrillo",
  },
];

const modelos = [
  {
    id: 1,
    name: "FF541-0",
  },
  {
    id: 2,
    name: "FDD41-2",
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

const bahias_asignadas = [
  {
    id: 1,
    name: "PS01",
  },
  {
    id: 2,
    name: "PS02",
  },
];

const flotas = [
  {
    id: 1,
    name: "SH01",
  },
  {
    id: 2,
    name: "SH02",
  },
];

const tipo_equipos = [
  {
    id: 1,
    name: "Pala hidráulica",
  },
  {
    id: 2,
    name: "Rastrillo",
  },
];

const actividades = [
  {
    id: 1,
    name: "Preventivo",
  },
  {
    id: 2,
    name: "Correctivo",
  },
];

const tipo_solicitudes = [
  {
    id: 1,
    name: "Plan",
  },
];
