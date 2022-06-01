import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MaestrosService } from "../maestros/maestros.service";
import { DashboardService } from "./dashboard.service";

@Injectable({
  providedIn: "root",
})
export class DashboardResolver implements Resolve<boolean> {
  private idUsuario: number;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private dashboardService: DashboardService,
    private maestroService: MaestrosService,
    private _userService: UserService
  ) {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.idUsuario = Number(user.id);
      });
  }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return forkJoin([
      this.dashboardService.getStatusFlota(),
      this.dashboardService.getActividadesNoEjecutadas(),
      this.dashboardService.getCodigoDemora(),
      this.maestroService.getClients({
        pageSize: 999,
        filter: {
          idUsuario: this.idUsuario,
        },
      }),
    ]);
  }
}
