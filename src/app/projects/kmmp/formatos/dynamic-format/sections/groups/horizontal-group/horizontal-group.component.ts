import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { GeneralParams } from "app/shared/models/formatos";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SectionsComponent } from "../../sections.component";

@Component({
  selector: "app-horizontal-group",
  templateUrl: "./horizontal-group.component.html",
  styleUrls: ["./horizontal-group.component.scss"],
})
export class HorizontalGroupComponent implements OnInit {
  @Input() groupData: any;
  isLoading: boolean;
  rowsOfGrid = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent
  ) {}

  ngOnInit(): void {
    this.createGrid();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.groupData = changes.groupData.currentValue;
  }

  async addParam(rowNumber?: number) {
    this.isLoading = true;
    let column: number;
    let row = rowNumber;

    let _column = [];
    await this.groupData.parametros.map((data) => {
      if (data.fila === row && data.columna) {
        _column.push(data.columna);
      }
    });
    const highestColumn = Math.max.apply(null, _column);
    column = highestColumn + 1;

    if (this.groupData.parametros && this.groupData.parametros.length === 0) {
      row = 1;
      column = 1;
    }

    const count = this.groupData.parametros.map((x) => x.activo);
    const textLength = count.length + 1;

    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: [
          {
            ...GeneralParams,
            label: "texto " + textLength,
            columna: column,
            fila: row,
            idGrupo: this.groupData.id,
          },
        ],
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._groups.loadGrupos();
        this.isLoading = false;
      });
  }

  async addRow() {
    this.isLoading = true;
    const rows = await this.groupData.parametros.map((data) => data.fila);
    const highestRow = Math.max.apply(null, rows);

    const count = this.groupData.parametros.map((x) => x.activo);
    const textLength = count.length + 1;

    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: [
          {
            ...GeneralParams,
            label: "texto " + textLength,
            columna: 1,
            fila: highestRow + 1,
            idGrupo: this.groupData.id,
          },
        ],
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._groups.loadGrupos();
        this.isLoading = false;
      });
  }

  private createGrid(): void {
    let rawData = [];
    this.getAllParameters().map((x: any) => {
      if (x) rawData.push(x.fila);
    });
    const allRowsInTable = rawData.filter(
      (value, index, x) => x.indexOf(value) === index
    );

    if (allRowsInTable.length > 0) {
      allRowsInTable.forEach((x) => {
        this.rowsOfGrid.push(
          [...this.groupData.parametros].filter(
            (param) => param.fila === x && param.activo
          )
        );
      });
    }
  }
  private getAllParameters(): number[] {
    let activeParams = [];
    this.groupData.parametros.forEach((x) => {
      if (x.columna && x.activo) activeParams.push(x);
    });

    return activeParams;
  }

  async drop(event: CdkDragDrop<string[]>, idx: number) {
    moveItemInArray(
      this.rowsOfGrid[idx],
      event.previousIndex,
      event.currentIndex
    );
    await this.rowsOfGrid[idx].map((x, i) => {
      x.columna = i + 1;
    });
    await this.groupData.parametros.map((x) =>
      this.rowsOfGrid[idx].find((y) => y.id === x.id)
    );

    this._editarFormatoService
      .createDato({
        ...this.groupData,
      })
      .subscribe(() => {});
  }
}
