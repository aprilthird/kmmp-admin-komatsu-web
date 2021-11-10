import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BahiaI, BahiaResponse, BahiaResponseI } from "./bahia-model";

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

  constructor(private http: HttpClient) {}

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
    const endpoint = "/Administracion/CrudBahias/" + 0;
    return this.http.post<PaginationResponse<BahiaI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      equipo
    );
  }

  getBahias(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<BahiaI[]>> {
    return this.http
      .get<PaginationResponse<BahiaI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/4"
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
        })
      );
  }

  getBahiasFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<BahiaResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: BahiaResponse.body.length,
      lastPage: Math.ceil(
        BahiaResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.bahias.next(BahiaResponse.body);
    return BahiaResponse;
  }
}
