import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { environment } from "environments/environment.kmmp";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { EquipoI, EquipoResponse, EquipoResponseI } from "./equipo-model";

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

  constructor(private http: HttpClient) {}

  get equipos$(): Observable<EquipoI[]> {
    return this.equipos.asObservable();
  }

  set equipos$(client: any) {
    this.equipos.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postClient(equipo): Observable<any> {
    const endpoint = "/Administracion/CrudEquipos/" + 0;
    return this.http.post<PaginationResponse<EquipoI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      equipo
    );
  }

  getEquipos(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<EquipoI[]>> {
    return this.http
      .get<PaginationResponse<EquipoI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/2"
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
          this.equipos.next(response.body.data);
        })
      );
  }

  getEquiposFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<EquipoResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: EquipoResponse.body.length,
      lastPage: Math.ceil(
        EquipoResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.equipos.next(EquipoResponse.body);
    return EquipoResponse;
  }
}
