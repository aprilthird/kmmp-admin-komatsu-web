import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { Response } from "app/shared/models/general-model";
import { SharedService } from "app/shared/shared.service";
import { environment } from "environments/environment";
import moment from "moment";

import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { ListadoService } from "../formatos/listado/listado.services";
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
  pageSize: 999,
  offset: 0,
  next: 0,
  filter: {
    id: 0,
    idUsuario: 0,
    dni: "",
    nombre: "",
    estado: 0,
    tipo: 1,
    fechaIni: moment().subtract(5, "years").format("yyyy-MM-DD"),
    fechaFin: moment().format("yyyy-MM-DD"),
    codigo: "",
  },
};

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  preloadedFormats: BehaviorSubject<any> = new BehaviorSubject(null);
  _activities: BehaviorSubject<any[]> = new BehaviorSubject(null);
  _dateRange: BehaviorSubject<any> = new BehaviorSubject(null);
  _pagination: BehaviorSubject<any> = new BehaviorSubject({
    length: 0,
    size: 10,
    page: 0,
    lastPage: 0,
    startIndex: 0,
    endIndex: 0,
  });

  constructor(
    private http: HttpClient,
    private _listadoService: ListadoService,
    private shared: SharedService
  ) {}

  get preloadedFormats$(): Observable<any> {
    return this.preloadedFormats.asObservable();
  }

  set preloadedFormats$(data) {
    this.preloadedFormats.next(data);
  }

  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  /*set activities$(data) {
    this._activities.next(data);
  }*/

  addNewActivity(newData) {
    let data: any = this._activities.asObservable();
    this._activities.next([newData, ...data.source.value]);
  }

  getList(tipo, idCliente?: number): Observable<Response> {
    return this.http.post<Response>(
      environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
      {
        ...getInboxParams,
        filter: {
          ...getInboxParams.filter,
          tipo: tipo,
          idCliente: idCliente,
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

  getActivities(
    {
      page,
      pageSize,
      idClaseActividad,
      idCliente,
      idModelo,
      idEquipo,
      idEstado,
      idTipoSolicitud,
      fechaInicio,
      fechaFin,
    }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<any[]> {
    this._listadoService._filter.next({
      idClaseActividad,
      idModelo,
      idEquipo,
      idEstado,
      idTipoSolicitud,
    });

    return this.http
      .post<any[]>(environment.apiUrl + "/Actividades/BandejaActividades", {
        ...getInboxParams,
        pageSize: pageSize,
        page: page,
        filter: {
          fechaIni: fechaInicio
            ? fechaInicio
            : moment().subtract(5, "years").format("yyyy-MM-DD"),
          fechaFin: fechaFin ? fechaFin : moment().format("yyyy-MM-DD"),
          idClaseActividad,
          idModelo,
          idEquipo,
          idEstado,
          idTipoSolicitud,
        },
      })
      .pipe(
        tap((resp: any) => {
          this._activities.next(resp.body.data);
          const document = [...resp.body.data].map((x) => {
            return {
              equipo: x.equipo,
              tipoEquipo: x.tipoEquipo,
              modelo: x.modelo,
              claseActividad: x.claseActividad,
              tipoMantenimiento: x.tipoMantenimiento,
              bahia: x.bahia,
              estado: x.nestado,
              tipoSolicitud: x.tipoSolicitud,
            };
          });

          this.shared.currentTableData.next(document);
          this._dateRange.next({
            fechaInicio: fechaInicio
              ? fechaInicio
              : moment().subtract(5, "years").format("yyyy-MM-DD"),
            fechaFin: fechaFin ? fechaFin : moment().format("yyyy-MM-DD"),
          });

          this._pagination.next({
            ...this._pagination.getValue(),
            page,
            size: pageSize,
            length: resp.body.totalRecords,
            lastPage: Math.ceil(
              resp.body.totalRecords / this._pagination.getValue().size
            ),
          });
        })
      );
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
