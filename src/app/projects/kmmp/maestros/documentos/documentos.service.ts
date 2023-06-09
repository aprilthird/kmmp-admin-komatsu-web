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
  DocumentoI,
  DocumentoResponse,
  DocumentoResponseI,
} from "./documento-model";
import { getInboxParams } from "../maestro-model";
import { environment } from "environments/environment";
import { MaestrosService } from "../maestros.service";

@Injectable({
  providedIn: "root",
})
export class DocumentosService {
  documentos: BehaviorSubject<DocumentoI[]> = new BehaviorSubject(null);
  _pagination: BehaviorSubject<any> = new BehaviorSubject({
    length: 0,
    size: 10,
    page: 0,
    lastPage: 0,
    startIndex: 0,
    endIndex: 0,
  });

  constructor(
    private http: HttpClient,
    private maestroService: MaestrosService
  ) {}

  get documentos$(): Observable<DocumentoI[]> {
    return this.documentos.asObservable();
  }

  set documentos$(client: any) {
    this.documentos.next(client);
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  postDocumento(documento): Observable<any> {
    const endpoint = "/api/Administracion/GestionDocumentaria";
    return this.http.post<PaginationResponse<DocumentoI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      documento
    );
  }

  getDocumentos(
    { page, pageSize, nombre }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<DocumentoI[]>> {
    return this.http
      .post<PaginationResponse<any[]>>(
        environment.apiUrl + "/Administracion/BandejaMaestrosPaginado",
        {
          ...getInboxParams,
          page,
          pageSize,
          filter: { ...getInboxParams.filter, nombre, tipo: 8 },
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
              cliente: x.cliente,
              modelo: x.modelo,
              clase_actividad: x.actividad,
              tipo_mantenimiento: x.tipoMantenimiento,
              estado: x.nestado,
            };
          });

          this.documentos.next(response.body.data);
          this.maestroService.currentTableData.next(document);
          this.maestroService.totalRecords.next(response.body.totalRecords);
        })
      );
  }
}
