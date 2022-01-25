import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { PermissionService } from "app/core/permission/permission.service";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DialogAddDocumentosComponent } from "./dialog-add-documentos/dialog-add-documentos.component";
import { DocumentosService } from "./documentos.service";

@Component({
  selector: "app-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"],
})
export class DocumentosComponent implements OnInit {
  isLoading = true;

  documentos$: Observable<any[]>;

  pagination$: Observable<Pagination>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public _permissonService: PermissionService,
    private _routeActived: ActivatedRoute,
    private _router: Router,
    private matDialog: MatDialog,
    private documentService: DocumentosService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
    this.getBabias();
  }

  ngOnInit(): void {
    this.loadData();
  }

  getBabias(): void {
    this.documentos$ = this.documentService.documentos$.pipe(
      takeUntil(this._unsubscribeAll)
    );

    this.pagination$ = this.documentService.pagination$;
  }

  loadData() {
    this.isLoading = true;
    this.documentService
      .getDocumentos(this._routeActived.snapshot.queryParams)
      .subscribe(() => {
        this.isLoading = false;
      });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setLoading(loading): void {
    this.isLoading = loading;
  }

  changePage(pagination: any): void {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this._router.onSameUrlNavigation = "reload";

    const params = this._routeActived.snapshot.params;
    this._router.navigate(["/admin/maestros/bahias"], {
      queryParams: {
        ...params,
        pageSize: pagination.pageSize,
        page: pagination.pageIndex,
      },
    });
  }

  createDocumento(): void {
    this.matDialog
      .open(DialogAddDocumentosComponent, {
        width: "400px",
        maxHeight: "100vh",
      })
      .afterClosed()
      .subscribe(() => this.loadData());
  }

  edit(doc): void {
    this.matDialog
      .open(DialogAddDocumentosComponent, {
        width: "400px",
        maxHeight: "100vh",
        data: doc,
      })
      .afterClosed()
      .subscribe(() => this.loadData());
  }

  delete(doc): void {
    doc.estado = 0;
    console.log(doc);

    const dialogRef = this._fuseConfirmationService.open({
      title: "Eliminar usuario",
      message: "¿Estás seguro que deseas eliminar este documento?",
      icon: {
        name: "heroicons_outline:trash",
        color: "primary",
      },
      actions: {
        confirm: {
          label: "Sí, eliminar",
          color: "primary",
        },
        cancel: {
          label: "No",
        },
      },
      dismissible: true,
    });

    dialogRef.beforeClosed().subscribe((result) => {
      if (result === "confirmed") {
        this.isLoading = true;
        this.documentService.postDocumento(doc).subscribe(() => {
          this.isLoading = false;
          this.loadData();
        });
      }
    });
  }
}
