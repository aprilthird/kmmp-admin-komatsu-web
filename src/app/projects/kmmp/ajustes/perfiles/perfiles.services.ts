import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Perfil } from "app/core/types/perfil.types";
import { Pagination } from "app/core/types/list.types";
import {
  PaginationResponse,
  ParamsPagination,
} from "app/core/types/http.types";
import { environment } from "environments/environment";
import { tap } from "rxjs/operators";
import { SharedService } from "app/shared/shared.service";

@Injectable({ providedIn: "root" })
export class PerfilesService {
  _perfiles: BehaviorSubject<Perfil[]> = new BehaviorSubject(null);
  _pagination: BehaviorSubject<any> = new BehaviorSubject({
    length: 0,
    size: 10,
    page: 0,
    lastPage: 0,
    startIndex: 0,
    endIndex: 0,
  });

  constructor(private _httpClient: HttpClient, private shared: SharedService) {}

  get perfiles$(): Observable<Perfil[]> {
    return this._perfiles.asObservable();
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  /**
   * Obtener el listado de perfiles
   */
  getPerfiles(
    { page, pageSize, ...filter }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<Perfil[]>> {
    return this._httpClient
      .get<PaginationResponse<Perfil[]>>(
        environment.apiUrl + "/Seguridad/ObtenerRoles/0"
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
          const document = [...response.body].map((x) => {
            return {
              Nombre: x.nombre,
              Numero_usuarios: x.numUsuarios,
              Creado: x.fechaReg,
              Modificado_por: x.usuarioMod,
            };
          });
          this._perfiles.next(response.body);
          this.shared.currentTableData.next(document);
        })
      );
  }

  deletePerfil(data): Observable<any> {
    return this._httpClient.post<any>(
      environment.apiUrl + "/Seguridad/GuardarRol",
      data
    );
  }
}
