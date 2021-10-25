import { Component, OnInit } from "@angular/core";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "list-activities",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  asignaciones$: Observable<any[]>;
  pagination$: Observable<Pagination>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading = false;
  asignaciones: any = Asignaciones;

  constructor() {}

  ngOnInit(): void {}

  changePage(): void {}
}

const Asignaciones = [
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
  {
    cliente: "Juan Pérez",
    equipo: "Pala hidráulica",
    modelo: "FF541-0",
    actividad: "Peventivo",
    tipo_mantenimiento: "PS02",
    bahia_asignada: "120-A",
    estado: "Sin empezar",
    tipo_solicitud: "Plan",
  },
];
