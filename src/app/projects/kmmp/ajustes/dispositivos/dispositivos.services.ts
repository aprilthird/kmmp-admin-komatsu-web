import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Pagination } from "app/core/types/list.types";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { environment } from "environments/environment";
import { tap } from "rxjs/operators";
import { getInboxParams } from "../../maestros/maestro-model";

@Injectable({ providedIn: "root" })
export class DispositivosService {
  _dispositivos: BehaviorSubject<any[]> = new BehaviorSubject(null);
  _pagination: BehaviorSubject<any> = new BehaviorSubject({
    length: 0,
    size: 10,
    page: 0,
    lastPage: 0,
    startIndex: 0,
    endIndex: 0,
  });

  constructor(private _httpClient: HttpClient) {}

  get dispositivos$(): Observable<any[]> {
    return this._dispositivos.asObservable();
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  /**
   * Obtener el listado de usuarios
   */
  getDispositivos(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<any[]>> {
    return this._httpClient
      .post<PaginationResponse<any[]>>(
        environment.apiUrl + "/Administracion/ObtenerDispositivos",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, tipo: 2 },
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
          this._dispositivos.next(response.body.data);
        })
      );
  }
}
