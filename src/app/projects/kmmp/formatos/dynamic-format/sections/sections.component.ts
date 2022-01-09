import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { EditarFormatoService } from "../../editar-formato/editar-formato.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";

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
  idSection: number;
  grupos: any[] = [];
  edit: boolean;
  @ViewChild("nameInput") el: ElementRef;

  constructor(
    private _activedRoute: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadGrupos();
  }

  ngOnDestry(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  postGroup(pos?: string): void {
    const long = this.grupos.length + 1;
    this._editarFormatoService
      .createGrupo({
        id: 0,
        idFormato: this._editarFormatoService._idFormulario.getValue(),
        idSeccion: this.sectionData.id,
        parametros: [],
        pos: pos,
        nombre: "Grupo " + long,
      })
      .subscribe(() => {
        this.loadGrupos();
      });
  }

  public loadGrupos() {
    if (this._activedRoute.snapshot.params.idSeccion) {
      this.idSection = { ...this.sectionData.id };
      if (this.idSection === 0) {
        this.grupos = [];
        this.isLoading = false;
      } else {
        this.isLoading = true;
        this._editarFormatoService
          .getGrupos(this.sectionData.id)
          .subscribe((response) => {
            this.isLoading = false;
            this.grupos = response.body;
          });
      }
    } else {
      this.isLoading = false;
    }
  }

  editSection(): void {
    this.edit = true;
    setTimeout(() => {
      this.el.nativeElement.select();
    });
  }
  save(): void {
    this._editarFormatoService.createSeccion({
      ...this.sectionData,
      nombre: this.el.nativeElement.value,
    });
    /*.subscribe(() => {
        this.edit = false;
        this.sectionData.nombre = this.el.nativeElement.value;
      });*/
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
      console.log(result);
      if (result === "confirmed") {
        this.isLoading = true;
        this._editarFormatoService.createSeccion({
          ...this.sectionData,
          activo: false,
        });
        /*.subscribe(() => {
            this.loadGrupos();
          });*/
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.grupos, event.previousIndex, event.currentIndex);
  }
}
