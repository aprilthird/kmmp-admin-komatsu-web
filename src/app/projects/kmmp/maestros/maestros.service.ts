import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ClientI } from "./clientes/client-model";
import { environment } from "environments/environment";
import { getInboxParams } from "./maestro-model";

@Injectable({
  providedIn: "root",
})
export class MaestrosService {
  clients: BehaviorSubject<ClientI[]> = new BehaviorSubject(null);
  _pagination: BehaviorSubject<any> = new BehaviorSubject({
    length: 0,
    size: 10,
    page: 0,
    lastPage: 0,
    startIndex: 0,
    endIndex: 0,
  });
  currentTableData: BehaviorSubject<any[]> = new BehaviorSubject(null);
  totalRecords: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  /********************CLIENTES********************/

  get clients$(): Observable<ClientI[]> {
    return this.clients.asObservable();
  }

  set clients$(client: any) {
    this.clients.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  get currentTableData$(): Observable<any[]> {
    return this.currentTableData.asObservable();
  }

  set currentTableData$(data: any) {
    this.currentTableData.next(data);
  }

  postClient(client): Observable<any> {
    const endpoint = `/Administracion/CrudClientes`;
    return this.http.post<PaginationResponse<ClientI[]>>(
      environment.apiUrl + endpoint,
      client
    );
  }

  getClients(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ClientI[]>> {
    return this.http
      .post<PaginationResponse<any[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 1 },
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
              ruc: x.ruc,
              razon_social: x.razon,
              ubicacion: x.ubicacion,
            };
          });
          this.clients.next(response.body.data);
          this.currentTableData.next(document);
          this.totalRecords.next(response.body.totalRecords);
        })
      );
  }

  getList(
    { tipo, idCliente, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<any[]> {
    return this.http.post<any[]>(
      environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
      {
        ...getInboxParams,
        pageSize,
        filter: {
          ...getInboxParams.filter,
          tipo: tipo,
          idCliente: idCliente,
        },
      }
    );
  }
}
