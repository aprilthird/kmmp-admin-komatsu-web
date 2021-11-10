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

  constructor(private http: HttpClient) {}

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
    const endpoint = "/Administracion/CrudAgregarDocumentos/" + 0;
    return this.http.post<PaginationResponse<DocumentoI[]>>(
      "https://development-kmp.ws.solera.pe" + endpoint,
      documento
    );
  }

  getDocumentos(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): Observable<PaginationResponse<DocumentoI[]>> {
    return this.http
      .get<PaginationResponse<DocumentoI[]>>(
        "https://development-kmp.ws.solera.pe" +
          "/Administracion/ObtenerGenerales/11"
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
          this.documentos.next(response.body.data);
        })
      );
  }

  getDocumentosFake(
    { page, pageSize }: ParamsPagination | any = {
      page: 0,
      pageSize: 10,
    }
  ): PaginationResponse<DocumentoResponseI[]> {
    this._pagination.next({
      ...this._pagination.getValue(),
      page,
      size: pageSize,
      length: DocumentoResponse.body.length,
      lastPage: Math.ceil(
        DocumentoResponse.body.length / this._pagination.getValue().size
      ),
    });
    this.documentos.next(DocumentoResponse.body);
    return DocumentoResponse;
  }
}
