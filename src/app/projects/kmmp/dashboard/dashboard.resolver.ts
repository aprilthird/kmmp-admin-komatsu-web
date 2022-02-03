import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { forkJoin, Observable, of } from "rxjs";
import { DashboardService } from "./dashboard.service";

@Injectable({
  providedIn: "root",
})
export class DashboardResolver implements Resolve<boolean> {
  constructor(private dashboardService: DashboardService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return forkJoin([
      this.dashboardService.getStatusFlota(),
      this.dashboardService.getActividadesNoEjecutadas(),
      this.dashboardService.getCodigoDemora(),
    ]);
  }
}
