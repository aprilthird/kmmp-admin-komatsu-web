import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Formato,
  Grupo,
  Parametro,
  Seccion,
} from "app/core/types/formatos.types";
import { HttpResponse } from "app/core/types/http.types";
import { CreateGrupoI } from "app/shared/models/formatos";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, of } from "rxjs";
import { exhaustMap, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class EditarFormatoService {
  _formato: BehaviorSubject<Formato> = new BehaviorSubject<Formato>(null);
  _tipo_mantenimeinto: BehaviorSubject<Formato> = new BehaviorSubject<Formato>(
    null
  );
  _actividad: BehaviorSubject<Formato> = new BehaviorSubject<Formato>(null);
  _modelo: BehaviorSubject<Formato> = new BehaviorSubject<Formato>(null);
  _secciones: BehaviorSubject<Seccion[]> = new BehaviorSubject<Seccion[]>(null);
  _tipoDatos: BehaviorSubject<Parametro[]> = new BehaviorSubject<Parametro[]>(
    null
  );
  _idFormulario: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) {}

  get secciones$(): Observable<Seccion[]> {
    return this._secciones.asObservable();
  }

  set secciones$(section: any) {
    this._secciones.next(section);
  }

  get formato$(): Observable<Formato> {
    return this._formato.asObservable();
  }

  getFormato(idFormato): Observable<any> {
    return this._httpClient
      .get<any>(environment.apiUrl + "/Core/ObtenerFormato/" + idFormato)
      .pipe(
        tap((response) => {
          if (response && response.body) {
            this._formato.next(response.body?.descripcion);
            this._tipo_mantenimeinto.next(response.body?.tipoMantenimiento);
            this._modelo.next(response.body?.modelo);
            this._actividad.next(response.body?.claseActividad);
          }
        })
      );
  }

  getObtenerFormatoCompleto(id): Observable<any> {
    return this._httpClient.get<any>(
      environment.apiUrl + "/Core/ObtenerFormatoCompleto/" + id
    );
  }

  getAbrirAsignacion(id): Observable<any> {
    return this._httpClient.get<any>(
      environment.apiUrl + "/Mantenimiento/AbrirAsignacion/" + id
    );
  }

  datos(): any {
    return this._tipoDatos.getValue().map((e) => ({
      id: e.id,
      label: e.nombre,
    }));
  }

  /**
   * Obtener las secciónes de un formulario
   * @param idSeccion i
   * @returns
   */
  getSecciones({ idFormulario, reload = false }): Observable<any> {
    return this._httpClient
      .get<HttpResponse<Seccion[]>>(
        environment.apiUrl + "/Core/ObtenerSecciones/" + idFormulario
      )
      .pipe(
        tap((response) => {
          this._secciones.next(response.body.filter((x) => x.activo));
        })
      );
  }

  getTipoDatos(): Observable<any> {
    if (this._tipoDatos.getValue()) return of(true);

    return this._httpClient
      .get<HttpResponse<Seccion[]>>(
        environment.apiUrl + "/Core/ObtenerParametros/0"
      )
      .pipe(
        tap((response) => {
          this._tipoDatos.next(response.body);
        })
      );
  }

  getGrupos(idSeccion): Observable<any> {
    return this._httpClient.get<HttpResponse<Grupo[]>>(
      environment.apiUrl + "/Core/ObtenerGrupos/" + idSeccion
    );
  }

  createSeccion(data): Observable<any> {
    return this._httpClient
      .post(environment.apiUrl + "/Core/GuardarSeccion", data)
      .pipe(
        exhaustMap(() =>
          this.getSecciones({ idFormulario: this._idFormulario.getValue() })
        )
      );
  }

  createGrupo(data: CreateGrupoI): Observable<HttpResponse<Grupo>> {
    return this._httpClient.post<HttpResponse<Grupo>>(
      environment.apiUrl + "/Core/GuardarGrupo",
      data
    );
  }

  createDato(data): Observable<any> {
    return this._httpClient.post<any>(
      environment.apiUrl + "/Core/GuardarParametrosxGrupo",
      data
    );
  }

  saveAssignation(data): Observable<any> {
    return this._httpClient.post<any>(
      environment.apiUrl + "/Mantenimiento/GuardarAsignacion",
      data
    );
  }
}
