import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { Pagination } from "app/core/types/list.types";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ModeloI, ModeloResponse, ModeloResponseI } from "./modelo-model";

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

  constructor(private http: HttpClient) {}

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
    const endpoint = "/Administracion/CrudModelos/" + 0;
    return this.http.post<PaginationResponse<ModeloI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      equipo
    );
  }

  getModelos(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<ModeloI[]>> {
    return this.http
      .get<PaginationResponse<ModeloI[]>>(
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
          this.modelos.next(response.body.data);
        })
      );
  }

  getModelosFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<ModeloResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: ModeloResponse.body.length,
      lastPage: Math.ceil(
        ModeloResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.modelos.next(ModeloResponse.body);
    return ModeloResponse;
  }
}
