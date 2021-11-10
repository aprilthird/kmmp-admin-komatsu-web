import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FlotaI, FlotaResponse, FlotaResponseI } from "./flota-model";

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

  constructor(private http: HttpClient) {}

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
    const endpoint = "/Administracion/Flotas/" + 0;
    return this.http.post<PaginationResponse<FlotaI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      equipo
    );
  }

  getFlotas(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<FlotaI[]>> {
    return this.http
      .get<PaginationResponse<FlotaI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/5"
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
          this.flotas.next(response.body.data);
        })
      );
  }

  getFlotasFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<FlotaResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: FlotaResponse.body.length,
      lastPage: Math.ceil(
        FlotaResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.flotas.next(FlotaResponse.body);
    return FlotaResponse;
  }
}
