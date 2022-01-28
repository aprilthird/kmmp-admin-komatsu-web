import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginationResponse } from "app/core/types/http.types";
import { Response } from "app/shared/models/general-model";
import { environment } from "environments/environment";

import { BehaviorSubject, Observable } from "rxjs";

import { ActivitiesData } from "../fake-db/activities/activity-fake-db";
import { DispositivoI } from "../maestros/dispositivos/dispositivo-model";

import { Activity as ActivityI } from "./models/activities-model";

//FILTER CONFIG

interface GetInbox {
  page: number | 0;
  pageSize: number | 200;
  offset: number | 0;
  next: number | 0;
  filter: {
    id: number;
    idUsuario: number;
    dni: string;
    nombre: string;
    estado: number | 1;
    tipo: number;
    fechaIni: string;
    fechaFin: string;
    codigo: string | "";
  };
}

const getInboxParams: GetInbox = {
  page: 0,
  pageSize: 200,
  offset: 0,
  next: 0,
  filter: {
    id: 0,
    idUsuario: 0,
    dni: "",
    nombre: "",
    estado: 0,
    tipo: 1,
    fechaIni: "2021-08-01",
    fechaFin: "2022-02-01",
    codigo: "",
  },
};

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  preloadedFormats: BehaviorSubject<any> = new BehaviorSubject(null);
  _activities: BehaviorSubject<any> = new BehaviorSubject(ActivitiesData);

  constructor(private http: HttpClient) {}

  get preloadedFormats$(): Observable<any> {
    return this.preloadedFormats.asObservable();
  }

  set preloadedFormats$(data) {
    this.preloadedFormats.next(data);
  }

  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }

  set activities$(data) {
    this._activities.next(data);
  }

  addNewActivity(newData) {
    let data: any = this._activities.asObservable();
    this._activities.next([newData, ...data.source.value]);
  }

  getList(tipo): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
      {
        ...getInboxParams,
        filter: {
          ...getInboxParams.filter,
          tipo: tipo,
        },
      }
    );
  }

  getTipoMtto(tipo, idClaseActividad?): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
      {
        ...getInboxParams,
        filter: {
          ...getInboxParams.filter,
          tipo: tipo,
          idClaseActividad: idClaseActividad,
        },
      }
    );
  }

  postCargaIndividual(data: ActivityI): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + "/Actividades/CargaIndividual",
      data
    );
  }

  getActivities(): Observable<any[]> {
    return this.http.post<any[]>(
      environment.apiUrl + "/Actividades/BandejaActividades",
      {
        ...getInboxParams,
        filter: {
          fechaIni: "2021-08-01",
          fechaFin: "2022-02-01",
        },
      }
    );
    /*.pipe(
        tap((resp: any) => {
          this._activities.next(resp.body.data);
        })
      );*/
  }

  getActivity(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + `/Actividades/ObtenerActividad/${id}`
    );
  }

  deleteFormatById(id: number): Observable<any[]> {
    return this.http.delete<any[]>(
      environment.apiUrl + `/Actividades/EliminarFormatoXActividad/${id}`
    );
  }

  asignMultipleActivities(data): Observable<any> {
    console.log(data);
    const endpoint =
      environment.apiUrl + "/Actividades/AsignarActividadesABahia";
    return this.http.post(endpoint, data);
  }

  massiveActivitiesUpload(file: any): Observable<any> {
    const endpoint = environment.apiUrl + "/Actividades/CargaMasiva";
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.http.post(endpoint, formData);
  }

  getResources(tipo: number): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + `/Actividades/ObtenerRecursos`,
      {
        id: tipo,
      }
    );
  }

  getBaysByDevice(idDevice: number): Observable<any> {
    const endpoint = `/Seguridad/ObtenerBahiasXDispositivo/${+idDevice}`;
    return this.http.get<PaginationResponse<DispositivoI[]>>(
      environment.apiUrl + endpoint
    );
  }

  postponeActivity(data): Observable<Response> {
    const endpoint = environment.apiUrl + "/Mantenimiento/Postergar";
    return this.http.post<Response>(endpoint, data);
  }

  postponeReason(): Observable<Response> {
    const endpoint = environment.apiUrl + "/Actividades/ObtenerRecursos";
    return this.http.post<Response>(endpoint, { id: 16 });
  }
}
