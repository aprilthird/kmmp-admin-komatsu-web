import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { FakeDbService } from "../fake-db/fake-db.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient, private fakeDB: FakeDbService) {}

  /**FAKE SERVICES */
  getAllStatusFlota(): any {
    const endpoint = this.fakeDB.createDb()["all_status_flota"];
    return endpoint;
  }

  getSingleStatusFlota(filter?): any {
    const endpoint = this.fakeDB.createDb()["single_status_flota"];
    return endpoint;
  }

  getSingleBarStatusFlota(filter?): any {
    const endpoint = this.fakeDB.createDb()["single_basic_bar_chart_flota"];
    return endpoint;
  }

  getAllNoExecutedActv(): any {
    const endpoint = this.fakeDB.createDb()["all_no_executed"];
    return endpoint;
  }

  getPosponedNoExecutedActv(filter?): any {
    const endpoint = this.fakeDB.createDb()["posponed_no_execued"];
    return endpoint;
  }

  getCausesNoExecutedActv(filter?): any {
    const endpoint = this.fakeDB.createDb()["causes_no_execued"];
    return endpoint;
  }

  getDelayedCode(filter?): any {
    const endpoint = this.fakeDB.createDb()["delayed_code"];
    return endpoint;
  }

  /**REAL SERVICES */

  getStatusFlota(filter): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/EstatusPorFlota";
    return this.http.post<Response>(endpoint, filter);
  }

  getStatusFlotaById(id): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/EstatusPorFlota" + id;
    return this.http.get<Response>(endpoint);
  }

  getActividadesNoEjecutadas(filter): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/ActividadesNoEjecutadas";
    return this.http.post<Response>(endpoint, filter);
  }

  getCodigoDemora(filter): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/CodigosDeDemoras";
    return this.http.post<Response>(endpoint, filter);
  }
}
