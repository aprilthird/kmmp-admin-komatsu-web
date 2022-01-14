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
  lowestRow: number;
  lowestColumn: number;
  highestColumn: number;
  isLoading: boolean;
  rowsOfGrid = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent
  ) {}

  ngOnInit(): void {
    this.createGrid();
    this.firstColumnRow();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.groupData = changes.groupData.currentValue;
  }

  firstColumnRow(): void {
    const columns = this.groupData.parametros
      .filter((data) => data.activo)
      .map((x) => x.columna);
    const rows = this.groupData.parametros
      .filter((data) => data.activo)
      .map((x) => x.fila);
    this.lowestRow = Math.min.apply(null, rows);
    this.lowestColumn = Math.min.apply(null, columns);
    this.highestColumn = Math.max.apply(null, columns);
  }

  async addColumn() {
    this.isLoading = true;
    const columns = [...this.groupData.parametros].map((data) => data.columna);
    const highestColumn = Math.max.apply(null, columns);

    /**for actives */
    const columnsActive = [...this.groupData.parametros]
      .filter((data) => data.activo)
      .map((x) => x.columna);
    const highestColumnActive = Math.max.apply(null, columnsActive);
    /**for actives */
    let lastColumn = [];

    console.log(
      [...this.groupData.parametros].map((data) => {
        if (data.columna === highestColumnActive && data.activo) return data;
      })
    );

    [...this.groupData.parametros].map((data) => {
      if (data.columna === highestColumnActive && data.activo)
        lastColumn.push(data);
    });

    const newColumn = await lastColumn.map((x) => {
      return {
        ...GeneralParams,
        columna: highestColumn + 1,
        fila: x.fila,
        idGrupo: x.idGrupo,
        idParametro: x.idParametro,
        label: x.label,
        placeholder: x.placeholder,
        dato: x.dato,
      };
    });
    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: newColumn,
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
    const newRow = [...this.rowsOfGrid[this.rowsOfGrid.length - 1]].map((x) => {
      return {
        ...GeneralParams,
        columna: x.columna,
        fila: highestRow + 1,
        idGrupo: x.idGrupo,
        idParametro: x.idParametro,
        label: x.label,
        placeholder: x.placeholder,
        dato: x.dato,
      };
    });

    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: newRow,
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

  async addParam() {
    this.isLoading = true;

    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: [
          {
            ...GeneralParams,
            fila: 1,
            columna: 1,
          },
        ],
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._groups.loadGrupos();
        this.isLoading = false;
      });
  }

  delete(position: number, type: string): void {
    let positionType;
    if (type === "row") positionType = "fila";
    else positionType = "columna";
    this.isLoading = true;
    const posToDelete = this.groupData.parametros.filter((x) => {
      if (x[positionType] === position) {
        x.activo = false;
        return x;
      }
    });
    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: posToDelete,
      })
      .subscribe(() => {
        this.isLoading = false;
        this._groups.loadGrupos();
      });
  }

  /**PROBANDO ELIMINACION DE COLUMNAS Y RESTAR UNA POSICIÓN A LAS SIGUIENTES COLUMNAS */
  deleteTMP(position: number, type: string): void {
    let positionType;
    if (type === "row") positionType = "fila";
    else positionType = "columna";
    this.isLoading = true;
    const posToDelete = this.groupData.parametros.filter((x) => {
      if (x[positionType] === position) {
        x.activo = false;
        return x;
      }
    });
    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: posToDelete,
      })
      .subscribe(() => {
        if (this.groupData.parametros.some((x) => x.columna === position + 1)) {
          let columnToMove = this.groupData.parametros.filter(
            (y) => y.position === position + 1
          );
          columnToMove.map((x) => (x.columna = x.columna - 1));

          this._editarFormatoService
            .createDato({
              ...this.groupData,
              parametros: columnToMove,
            })
            .subscribe(() => {
              this.isLoading = false;
              this._groups.loadGrupos();
            });
        }
      });
  }

  /*async addParam(rowNumber?: number) {
    this.isLoading = true;
    let column: number;
    let row = rowNumber;
    let parametrosPayload;

    let _column = [];
    await this.groupData.parametros.map((data) => {
      if (data.fila === row && data.columna) {
        _column.push(data.columna);
      }
    });
    const highestColumn = Math.max.apply(null, _column);
    column = highestColumn + 1;
    const count = this.groupData.parametros.map((x) => x.activo);
    const textLength = count.length + 1;
    let label = "";

    const previousParams = this.groupData.parametros.find(
      (x) => x.fila === rowNumber && x.columna === highestColumn
    );

    if (this.groupData.parametros.length === 0) {
      row = 1;
      column = 1;
      parametrosPayload = {
        ...GeneralParams,
        label: "",
        columna: column,
        fila: row,
        idGrupo: this.groupData.id,
      };
    } else {
      if (previousParams.idParametro === 8) {
        label = "Label";
      }
      parametrosPayload = {
        ...GeneralParams,
        idParametro: previousParams.idParametro,
        label: label,
        fila: previousParams.fila,
        columna: column,
        idGrupo: previousParams.idGrupo,
        dato: previousParams.dato,
      };
    }

    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: [parametrosPayload],
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
            //label: "texto " + textLength,
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
  }*/

  /*async drop(event: CdkDragDrop<string[]>, idx: number) {
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
  }*/
}
