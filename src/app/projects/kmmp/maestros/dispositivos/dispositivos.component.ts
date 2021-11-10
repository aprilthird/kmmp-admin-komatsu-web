import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionService } from "app/core/permission/permission.service";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DialogAddDispositivosComponent } from "./dialog-add-dispositivos/dialog-add-dispositivos.component";
import { DispositivoI } from "./dispositivo-model";
import { DispositivosService } from "./dispositivos.service";

@Component({
  selector: "app-dispositivos",
  templateUrl: "./dispositivos.component.html",
  styleUrls: ["./dispositivos.component.scss"],
})
export class DispositivosComponent implements OnInit {
  isLoading = true;

  dispositivos$: Observable<DispositivoI[]>;

  pagination$: Observable<Pagination>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public _permissonService: PermissionService,
    private _routeActived: ActivatedRoute,
    private _router: Router,
    private matDialog: MatDialog,
    private dispositivosService: DispositivosService
  ) {
    this.getBabias();
  }

  ngOnInit(): void {
    this.loadData();
  }

  getBabias(): void {
    this.dispositivos$ = this.dispositivosService.dispositivos$.pipe(
      takeUntil(this._unsubscribeAll)
    );

    this.pagination$ = this.dispositivosService.pagination$;
  }

  loadData() {
    this.isLoading = true;
    this.dispositivosService.getDispositivoFake();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changePage(pagination: any): void {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this._router.onSameUrlNavigation = "reload";

    const params = this._routeActived.snapshot.params;
    this._router.navigate(["/admin/maestros/dispositivos"], {
      queryParams: {
        ...params,
        pageSize: pagination.pageSize,
        page: pagination.pageIndex,
      },
    });
  }

  deleteDispositivo(): void {}

  createDispositivo(): void {
    this.matDialog.open(DialogAddDispositivosComponent, {
      width: "400px",
      maxHeight: "100vh",
    });
  }
}
