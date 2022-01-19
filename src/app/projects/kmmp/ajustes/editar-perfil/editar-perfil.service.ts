import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "environments/environment";
import { PaginationResponse } from "app/core/types/http.types";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class EditarPerfilService {
  _menu: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) {}

  get menu$(): Observable<any> {
    return this._menu.asObservable();
  }

  savePerfil(data): Observable<any> {
    return this._httpClient.post<any>(
      environment.apiUrl + "/Seguridad/GuardarRol",
      data
    );
  }

  getObtenerPerfil(idPerfil): Observable<any> {
    return this._httpClient.get<PaginationResponse<any[]>>(
      environment.apiUrl + "/Seguridad/ObtenerRoles/" + idPerfil
    );
  }

  getObtenerMenu(idPerfil): Observable<any> {
    return this._httpClient
      .get<any>(environment.apiUrl + "/Seguridad/ObtenerArbol/" + idPerfil)
      .pipe(
        tap((response) => {
          response.body.map((x) => {
            if (x.idOpcion === 34) return (x.nombre = "Perfil para app");
            if (x.idOpcion === 32) return (x.nombre = "Editar perfil en app");
            if (x.idOpcion === 33) return (x.nombre = "Comentar perfil en app");
          });
          this._menu.next(response.body);
        })
      );
  }

  updateOpcion(idOpcion, data = {}): Observable<any> {
    return this._httpClient.put<any>(
      environment.apiUrl + "/Seguridad/ModificarOpcion/" + idOpcion,
      data
    );
  }

  updateAccion(idAccion): Observable<any> {
    return this._httpClient.put<any>(
      environment.apiUrl + "/Seguridad/ModificarAccion/" + idAccion,
      {}
    );
  }
}
