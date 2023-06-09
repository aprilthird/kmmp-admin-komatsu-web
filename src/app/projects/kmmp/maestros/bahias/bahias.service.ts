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
import { BahiaI } from "./bahia-model";

@Injectable({
  providedIn: "root",
})
export class BahiasService {
  bahias: BehaviorSubject<BahiaI[]> = new BehaviorSubject(null);
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

  get bahias$(): Observable<BahiaI[]> {
    return this.bahias.asObservable();
  }

  set bahias$(client: any) {
    this.bahias.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postBahia(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudBahias";
    return this.http.post<PaginationResponse<BahiaI[]>>(
      environment.apiUrl + endpoint,
      equipo
    );
  }

  getBahias(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<BahiaI[]>> {
    return this.http
      .post<PaginationResponse<BahiaI[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 4 },
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
          this.bahias.next(response.body.data);
          const document = [...response.body.data].map((x) => {
            return {
              nombre: x.nombre,
              cliente: x.cliente,
              estado: x.nestado,
            };
          });
          this.maestroService.currentTableData.next(document);
          this.maestroService.totalRecords.next(response.body.totalRecords);
        })
      );
  }
}
