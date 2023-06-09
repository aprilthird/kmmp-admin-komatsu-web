import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { getInboxParams } from "../maestro-model";
import { MaestrosService } from "../maestros.service";
import { FlotaI } from "./flota-model";

@Injectable({
  providedIn: "root",
})
export class FlotasService {
  flotas: BehaviorSubject<FlotaI[]> = new BehaviorSubject(null);
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

  get flotas$(): Observable<FlotaI[]> {
    return this.flotas.asObservable();
  }

  set flotas$(flota: any) {
    this.flotas.next(flota);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postFlota(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudFlotas";
    return this.http.post<PaginationResponse<FlotaI[]>>(
      environment.apiUrl + endpoint,
      equipo
    );
  }

  getFlotas(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<FlotaI[]>> {
    return this.http
      .post<PaginationResponse<FlotaI[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 6 },
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
              cliente: x.cliente,
              estado: x.nestado,
            };
          });
          this.flotas.next(response.body.data);
          this.maestroService.currentTableData.next(document);
          this.maestroService.totalRecords.next(response.body.totalRecords);
        })
      );
  }
}
