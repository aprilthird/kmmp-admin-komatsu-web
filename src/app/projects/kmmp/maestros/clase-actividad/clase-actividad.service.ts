import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { environment } from "environments/environment";
import moment from "moment";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { getInboxParams } from "../maestro-model";
import { MaestrosService } from "../maestros.service";
import { ClaseActividadI } from "./clase-actividad-model";

@Injectable({
  providedIn: "root",
})
export class ClaseActividadService {
  clase_actividades: BehaviorSubject<ClaseActividadI[]> = new BehaviorSubject(
    null
  );
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
    private maestroService: MaestrosService
  ) {}

  get clase_actividades$(): Observable<ClaseActividadI[]> {
    return this.clase_actividades.asObservable();
  }

  set clase_actividades$(clase_actividad: any) {
    this.clase_actividades.next(clase_actividad);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postClaseActivida(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudClaseActividad";
    return this.http.post<PaginationResponse<ClaseActividadI[]>>(
      environment.apiUrl + endpoint,
      equipo
    );
  }

  postTipoMantenimeinto(data): Observable<any> {
    const endpoint = "/Administracion/CrudTipoMantenimiento";
    return this.http.post<PaginationResponse<ClaseActividadI[]>>(
      environment.apiUrl + endpoint,
      data
    );
  }

  getTipoMantenimiento(
    { idClaseActividad, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<any> {
    const filter = {
      pageSize,
      filter: {
        id: 0,
        idUsuario: 0,
        estado: 0,
        tipo: 9,
        idClaseActividad: idClaseActividad,
        fechaIni: moment().subtract(3, "years").format("yyyy-MM-DD"),
        fechaFin: moment().format("yyyy-MM-DD"),
      },
    };
    const endpoint =
      environment.apiUrl + "/Administracion/BandejaMaestrosPaginado";
    return this.http.post(endpoint, filter);
  }

  getClaseActividad(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ClaseActividadI[]>> {
    return this.http
      .post<PaginationResponse<ClaseActividadI[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: {
            ...getInboxParams.filter,
            nombre,
            tipo: 7,
          },
        }
      )
      .pipe(
        tap((response) => {
          this._pagination.next({
            ...this._pagination.getValue(),
            page,
            size: pageSize,
            length: response.body.totalRecords,
            lastPage: Math.ceil(
              response.body.totalRecords / this._pagination.getValue().size
            ),
          });
          const document = [...response.body.data].map((x) => {
            return {
              nombre: x.nombre,
              estado: x.nestado,
            };
          });
          this.clase_actividades.next(response.body.data);
          this.maestroService.currentTableData.next(document);
        })
      );
  }
}
