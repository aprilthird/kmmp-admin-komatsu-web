import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response } from "app/shared/models/general-model";
import { environment } from "environments/environment";
import moment from "moment";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FakeDbService } from "../fake-db/fake-db.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  _rangeDate: BehaviorSubject<any> = new BehaviorSubject({
    endDate: moment().format("yyyy-MM-DD"),
    startDate: moment().subtract(14, "days").format("yyyy-MM-DD"),
  });

  _statusXflota: BehaviorSubject<any> = new BehaviorSubject(null);
  _summary: BehaviorSubject<any> = new BehaviorSubject(null);
  _statusflotaById: BehaviorSubject<any> = new BehaviorSubject(null);
  _activitiesNoCompleted: BehaviorSubject<any> = new BehaviorSubject(null);
  _delayedCode: BehaviorSubject<any> = new BehaviorSubject(null);
  _activitiesNoCompletedByState: BehaviorSubject<any> = new BehaviorSubject(
    null
  );

  constructor(private http: HttpClient, private fakeDB: FakeDbService) {}

  get statusFlota$(): Observable<any> {
    return this._statusXflota.asObservable();
  }

  get statusFlotaId$(): Observable<any> {
    return this._statusflotaById.asObservable();
  }

  get summary$(): Observable<any> {
    return this._summary.asObservable();
  }

  get activitiesNoCompleted$(): Observable<any> {
    return this._activitiesNoCompleted.asObservable();
  }

  get activitiesNoCompletedByState$(): Observable<any> {
    return this._activitiesNoCompletedByState.asObservable();
  }

  get delayedCode$(): Observable<any> {
    return this._delayedCode.asObservable();
  }

  /**FAKE SERVICES */
  // getAllStatusFlota(): any {
  //   const endpoint = this.fakeDB.createDb()["all_status_flota"];
  //   return endpoint;
  // }

  // getSingleStatusFlota(filter?): any {
  //   const endpoint = this.fakeDB.createDb()["single_status_flota"];
  //   return endpoint;
  // }

  // getSingleBarStatusFlota(filter?): any {
  //   const endpoint = this.fakeDB.createDb()["single_basic_bar_chart_flota"];
  //   return endpoint;
  // }

  // getAllNoExecutedActv(): any {
  //   const endpoint = this.fakeDB.createDb()["all_no_executed"];
  //   return endpoint;
  // }

  // getPosponedNoExecutedActv(filter?): any {
  //   const endpoint = this.fakeDB.createDb()["posponed_no_execued"];
  //   return endpoint;
  // }

  // getCausesNoExecutedActv(filter?): any {
  //   const endpoint = this.fakeDB.createDb()["causes_no_execued"];
  //   return endpoint;
  // }

  // getDelayedCode(filter?): any {
  //   const endpoint = this.fakeDB.createDb()["delayed_code"];
  //   return endpoint;
  // }

  /**REAL SERVICES */

  getStatusFlota(filter = this._rangeDate.getValue()): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/EstatusFlotas";
    return this.http.post<Response>(endpoint, filter).pipe(
      tap((statusFlota: any) => {
        this._statusXflota.next(statusFlota?.body?.estatusFlotas);
        this._summary.next({
          observadas: statusFlota?.body?.observadas,
          sinEmpezar: statusFlota?.body?.sinEmpezar,
          totalEjecutadas: statusFlota?.body?.totalEjecutadas,
          totalNoEjecutadas: statusFlota?.body?.totalNoEjecutadas,
          validadas: statusFlota?.body?.validadas,
          enProceso: statusFlota?.body?.enProceso,
        });
      })
    );
  }

  getStatusFlotaById(id): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/EstatusPorFlota/" + id;
    return this.http.get<Response>(endpoint).pipe(
      tap((statusFlotaId) => {
        this._statusflotaById.next(statusFlotaId);
      })
    );
  }

  getActividadesNoEjecutadas(
    filter = this._rangeDate.getValue()
  ): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/ActividadesNoCompletadas";
    return this.http.post<Response>(endpoint, filter).pipe(
      tap((noCompleted) => {
        this._activitiesNoCompleted.next(noCompleted);
      })
    );
  }

  getNoExecuteActivitiesyState(
    filter = this._rangeDate.getValue()
  ): Observable<Response> {
    const endpoint =
      environment.apiUrl + "/Reportes/ActividadesNoEjecutadasPorEstado";
    return this.http.post<Response>(endpoint, filter).pipe(
      tap((noCompletedByState) => {
        this._activitiesNoCompletedByState.next(noCompletedByState);
      })
    );
  }

  getCodigoDemora(filter = this._rangeDate.getValue()): Observable<Response> {
    const endpoint = environment.apiUrl + "/Reportes/CodigosDeDemoras";
    return this.http.post<Response>(endpoint, filter).pipe(
      tap((delayedCode) => {
        this._delayedCode.next(delayedCode);
      })
    );
  }
}
