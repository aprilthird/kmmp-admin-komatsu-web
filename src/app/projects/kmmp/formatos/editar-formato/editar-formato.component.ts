import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Formato, Grupo } from "app/core/types/formatos.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Sortable from "sortablejs";
import { DialogAddGrupoComponent } from "../components/dialog-add-grupo/dialog-add-grupo.component";
import { DialogAddSeccionComponent } from "../components/dialog-add-seccion/dialog-add-seccion.component";
import { DialogPrevisualizarComponent } from "../components/dialog-previsualizar/dialog-previsualizar.component";
import { EditarFormatoService } from "./editar-formato.service";

@Component({
  selector: "app-editar-formato",
  templateUrl: "./editar-formato.component.html",
  styleUrls: ["./editar-formato.component.scss"],
})
export class EditarFormatoComponent implements OnInit, OnDestroy {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;

  currentSeccion: string;
  drawerMode: "side" | "over";
  drawerOpened: boolean;
  menuData: any[];

  grupos: Grupo[] = [];
  loading: boolean = true;

  formato$: Observable<Formato>;
  tipoMantenimiento$: Observable<Formato>;
  modelo$: Observable<Formato>;
  actividad$: Observable<Formato>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  idSection: number;
  validSection: boolean;
  constructor(
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    public dialog: MatDialog,
    private _activedRoute: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
    this.getSections();
    this.formato$ = this._editarFormatoService._formato.pipe(
      takeUntil(this._unsubscribeAll)
    );
    this.tipoMantenimiento$ =
      this._editarFormatoService._tipo_mantenimeinto.pipe(
        takeUntil(this._unsubscribeAll)
      );
    this.actividad$ = this._editarFormatoService._actividad.pipe(
      takeUntil(this._unsubscribeAll)
    );
    this.modelo$ = this._editarFormatoService._modelo.pipe(
      takeUntil(this._unsubscribeAll)
    );
  }

  private getSections(): void {
    this._editarFormatoService.secciones$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((secciones) => {
        this.menuData = secciones.map((e) => ({
          id: e.id,
          title: e.nombre,
          type: "basic",
          link: `/admin/formatos/editar/${this._activedRoute.snapshot.params.id}/${e.id}`,
        }));
        setTimeout(() => {
          this.validSection = secciones.some(
            (section) =>
              section.id ===
              Number(this._activedRoute.snapshot.params.idSeccion)
          );
        }, 500);
      });
  }

  ngOnInit(): void {
    // Subscribe to media query change
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes("md")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this._router.events.pipe(takeUntil(this._unsubscribeAll)).subscribe((e) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.loading = true;
        this.loadGrupos();
      }
    });

    this.loadGrupos();

    var el = document.getElementById("items");
    var sortable = Sortable.create(el);
  }

  deleteSection(menu): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Eliminar sección",
      message: "¿Estás seguro que desea eliminar ésta sección?",

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
      const data = {
        idFormat: Number(this._activedRoute.snapshot.params.id),
        id: menu.id,
        activo: false,
        nombre: menu.title,
      };

      if (result === "confirmed") {
        this._editarFormatoService.createSeccion(data, true).subscribe(() => {
          this._editarFormatoService
            .getSecciones({
              idFormulario: Number(this._activedRoute.snapshot.params.id),
            })
            .subscribe(() => {});
        });
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadGrupos() {
    if (this._activedRoute.snapshot.params.idSeccion) {
      this.idSection = Number(this._activedRoute.snapshot.params.idSeccion);
      if (this.idSection === 0) {
        this.grupos = [];
        this.loading = false;
      } else {
        this.loading = true;
        this._editarFormatoService
          .getGrupos(this._activedRoute.snapshot.params.idSeccion)
          .subscribe((response) => {
            this.currentSeccion = this.menuData.find(
              (e) =>
                e.id === Number(this._activedRoute.snapshot.params.idSeccion)
            )?.title;
            this.loading = false;
            this.grupos = response.body;
          });
      }
    } else {
      this.loading = false;

      if (this.menuData.length > 0)
        this._router.navigateByUrl(
          `/admin/formatos/editar/${this._activedRoute.snapshot.params.id}/${this.menuData[0].id}`
        );
    }
  }

  clickNewSeccion() {
    const dialogRef = this.dialog.open(DialogAddSeccionComponent, {
      autoFocus: false,
      width: "376px",
    });

    dialogRef.componentInstance.idFormato =
      this._activedRoute.snapshot.params.id;
    dialogRef.componentInstance.success.subscribe(() => {
      this._editarFormatoService
        .getSecciones({
          idFormulario: this._activedRoute.snapshot.params.id,
          reload: true,
        })
        .subscribe(() => {});
      dialogRef.close();
    });
  }

  clickNewGrupo() {
    const dialogRef = this.dialog.open(DialogAddGrupoComponent, {
      autoFocus: false,
      width: "376px",
    });

    dialogRef.componentInstance.idFormato =
      this._activedRoute.snapshot.params.id;
    dialogRef.componentInstance.idSeccion =
      this._activedRoute.snapshot.params.idSeccion;

    dialogRef.componentInstance.success.subscribe((grupo) => {
      //this.grupos.push(grupo);
      this.loadGrupos();
      dialogRef.close(close);
    });
  }

  clickPrevisualizar() {
    const dialogRef = this.dialog.open(DialogPrevisualizarComponent, {
      data: { previsualizar: true },
    });
    dialogRef.componentInstance.id = this._activedRoute.snapshot.params.id;
  }
}
