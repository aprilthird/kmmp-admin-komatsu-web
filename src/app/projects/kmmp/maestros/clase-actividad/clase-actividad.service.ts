import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  ClaseActividadI,
  ClaseActividadResponse,
  ClaseActividadResponseI,
} from "./clase-actividad-model";

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

  constructor(private http: HttpClient) {}

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
    const endpoint = "/Administracion/CrudClaseActividad/" + 0;
    return this.http.post<PaginationResponse<ClaseActividadI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      equipo
    );
  }

  postTipoMantenimeinto(data): Observable<any> {
    const endpoint = "/api/Administracion/CrudTipoMantenimiento/" + 0;
    return this.http.post<PaginationResponse<ClaseActividadI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      data
    );
  }

  getClaseActividad(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ClaseActividadI[]>> {
    return this.http
      .get<PaginationResponse<ClaseActividadI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/6"
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
          this.clase_actividades.next(response.body.data);
        })
      );
  }

  getClaseActidadFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<ClaseActividadResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: ClaseActividadResponse.body.length,
      lastPage: Math.ceil(
        ClaseActividadResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.clase_actividades.next(ClaseActividadResponse.body);
    return ClaseActividadResponse;
  }
}
