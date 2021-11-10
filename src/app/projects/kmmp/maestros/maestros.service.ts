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
  ClientResponse,
  ClientResponseI,
  ClientI,
} from "./clientes/client-model";
import { environment } from "environments/environment";

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

  postClient(client): Observable<any> {
    const endpoint = "/Administracion/CrudClientes/" + 0;
    return this.http.post<PaginationResponse<ClientI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      client
    );
  }

  getClients(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ClientI[]>> {
    return this.http
      .get<PaginationResponse<ClientI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/1"
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
          this.clients.next(response.body.data);
        })
      );
  }

  getClientsFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<ClientResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: ClientResponse.body.length,
      lastPage: Math.ceil(
        ClientResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.clients.next(ClientResponse.body);
    return ClientResponse;
  }

  /********************EQUIPOS********************/
}
