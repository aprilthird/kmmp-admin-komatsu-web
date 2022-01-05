import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { FormatosService } from "../formatos.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Formato, Grupo } from "app/core/types/formatos.types";
import { exhaustMap, takeUntil, tap } from "rxjs/operators";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dynamic-format",
  templateUrl: "./dynamic-format.component.html",
  styleUrls: ["./dynamic-format.component.scss"],
})
export class DynamicFormatComponent implements OnInit {
  isLoading: boolean;
  sections;

  formato: Formato;
  tipoMantenimiento: Formato;
  modelo: Formato;
  actividad: Formato;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  idFormat: number;

  constructor(
    private _formatosService: FormatosService,
    private _editarFormatoService: EditarFormatoService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSections();
    this.getFormatInfo();
  }

  getFormatInfo(): void {
    this._editarFormatoService._formato.subscribe((format) => {
      this.formato = format;
    });
    this._editarFormatoService._tipo_mantenimeinto.subscribe(
      (t_mant) => (this.tipoMantenimiento = t_mant)
    );
    this._editarFormatoService._actividad.subscribe(
      (actividad) => (this.actividad = actividad)
    );
    this._editarFormatoService._modelo.subscribe(
      (modelo) => (this.modelo = modelo)
    );

    this._activatedRoute.params.subscribe((params) => {
      this.idFormat = Number(params["id"]);
    });

    console.log("sections ", this.sections);
  }

  ngOnDestry(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getSections(): void {
    this._editarFormatoService._secciones.subscribe(
      (sections) => (this.sections = sections)
    );
  }

  postSection(section): void {
    const sectionLength =
      this._editarFormatoService._secciones.getValue().length + 1;
    const sectionName = "Sección " + sectionLength;
    this._editarFormatoService._idFormulario.next(this.idFormat);

    this._editarFormatoService
      .createSeccion({
        idFormato: this.idFormat,
        nombre: sectionName,
      })
      .subscribe(() => []);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }
}
