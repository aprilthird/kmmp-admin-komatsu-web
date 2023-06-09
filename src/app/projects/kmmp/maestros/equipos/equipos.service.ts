import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { getInboxParams } from "../maestro-model";
import { MaestrosService } from "../maestros.service";
import { EquipoI } from "./equipo-model";

@Injectable({
  providedIn: "root",
})
export class EquiposService {
  equipos: BehaviorSubject<EquipoI[]> = new BehaviorSubject(null);
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

  get equipos$(): Observable<EquipoI[]> {
    return this.equipos.asObservable();
  }

  set equipos$(client: any) {
    this.equipos.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postEquipo(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudEquipos";
    return this.http.post<PaginationResponse<EquipoI[]>>(
      environment.apiUrl + endpoint,
      equipo
    );
  }

  getEquipos(
    { page, pageSize, nombre, id }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<EquipoI[]>> {
    return this.http
      .post<PaginationResponse<EquipoI[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 2, id: id },
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
              TAG: x.tag,
              modelo: x.modelo,
              flota: x.flota,
              cliente: x.cliente,
              horometro: x.horometro,
              estado: x.nestado,
            };
          });
          this.equipos.next(response.body.data);
          this.maestroService.currentTableData.next(document);
          this.maestroService.totalRecords.next(response.body.totalRecords);
        })
      );
  }
}
