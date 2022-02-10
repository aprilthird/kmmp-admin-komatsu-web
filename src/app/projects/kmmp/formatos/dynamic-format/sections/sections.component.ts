import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { EditarFormatoService } from "../../editar-formato/editar-formato.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { FormatosService } from "../../formatos.service";
import { GroupI } from "app/shared/models/formatos";

@Component({
  selector: "app-sections",
  templateUrl: "./sections.component.html",
  styleUrls: ["./sections.component.scss"],
})
export class SectionsComponent implements OnInit {
  @Input() sectionData: any;
  isLoading: boolean;
  sections$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  grupos: any[] = [];
  edit: boolean;
  @ViewChild("nameInput") el: ElementRef;

  constructor(
    private _activedRoute: ActivatedRoute,

    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formatService: FormatosService
  ) {}

  ngOnInit(): void {
    this.loadGrupos();
  }

  ngOnDestry(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  postGroup(pos?: string): void {
    this._editarFormatoService
      .createGrupo({
        id: 0,
        idFormato: this._formatService._idFormulario.getValue(),
        idSeccion: this.sectionData.id,
        parametros: [],
        pos: pos,
        nombre: "Nuevo Grupo",
      })
      .subscribe(() => {
        this.loadGrupos();
      });
  }

  public loadGrupos() {
    this.isLoading = true;
    //this.grupos = [];
    this.isLoading = true;
    this._editarFormatoService
      .getGrupos(this.sectionData.id)
      .subscribe((response) => {
        this.isLoading = false;
        this.grupos = response.body;
      });

    this.isLoading = false;
  }

  editSection(): void {
    this.edit = true;
    setTimeout(() => {
      this.el.nativeElement.select();
    });
  }
  save(): void {
    this._editarFormatoService
      .createSeccion(
        {
          ...this.sectionData,
          nombre: this.el.nativeElement.value,
        },
        false
      )
      .subscribe(() => {
        this.edit = false;
        this.sectionData.nombre = this.el.nativeElement.value;
        this.loadGrupos();
      });
  }

  deleteSection(): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Eliminar Sección",
      message: "¿Estás seguro que deseas eliminar ésta Sección?",
      icon: {
        name: "heroicons_outline:trash",
      },
      actions: {
        confirm: {
          label: "Sí, eliminar",
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
        this._editarFormatoService
          .createSeccion(
            {
              ...this.sectionData,
              activo: false,
            },
            true
          )
          .subscribe(() => {
            this.loadGrupos();
          });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.grupos, event.previousIndex, event.currentIndex);
  }

  trackByFn(index: number, item: GroupI): number {
    return item.id;
  }

  isActiveGroup(): boolean {
    return this.grupos.some((x) => x.activo);
  }
}
