import { Component, Input, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { EditarFormatoService } from "../../editar-formato/editar-formato.service";

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

  constructor(
    private _activedRoute: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService
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
      this.idSection = this.sectionData.id;
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.grupos, event.previousIndex, event.currentIndex);
  }
}
