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
import { ModeloI } from "./modelo-model";

@Injectable({
  providedIn: "root",
})
export class ModelosService {
  modelos: BehaviorSubject<ModeloI[]> = new BehaviorSubject(null);
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

  get modelos$(): Observable<ModeloI[]> {
    return this.modelos.asObservable();
  }

  set modelos$(client: any) {
    this.modelos.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postModelo(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudModelos";
    return this.http.post<PaginationResponse<ModeloI[]>>(
      environment.apiUrl + endpoint,
      equipo
    );
  }

  getModelos(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ModeloI[]>> {
    return this.http
      .post<PaginationResponse<ModeloI[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 5 },
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
          this.modelos.next(response.body.data);
          this.maestroService.currentTableData.next(document);
        })
      );
  }
}
