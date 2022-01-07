import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { EditarFormatoService } from "../../../editar-formato/editar-formato.service";
import { SectionsComponent } from "../sections.component";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
})
export class GroupsComponent implements OnInit {
  @Input() groupData: any;
  isLoading: boolean;
  rowsOfGrid = [];

  constructor() //private _editarFormatoService: EditarFormatoService,
  //private _groups: SectionsComponent
  {}

  ngOnInit(): void {
    if (this.groupData.pos === "h") {
      //this.createGrid();
    }
  }
  /*ngOnChanges(changes: SimpleChanges): void {
    this.groupData = changes.groupData.currentValue;
    if (this.groupData.pos === "v") {
      const activeParams = this.groupData.parametros.filter((x) => x.activo);
      this.groupData = { ...this.groupData, parametros: activeParams };
    }
  }

  async postParam(rowNumber?: number) {
    this.isLoading = true;
    let column: number;
    let row: number;

    if (rowNumber != undefined) {
      row = rowNumber;

      let _column = [];
      await this.groupData.parametros.map((data) => {
        if (data.fila === row && data.columna) {
          _column.push(data.columna);
        }
      });
      const highestColumn = Math.max.apply(null, _column);
      column = highestColumn + 1;
    } else {
      const rows = await this.groupData.parametros.map((data) => data.fila);
      const highestRow = Math.max.apply(null, rows);
      row = highestRow + 1;
    }

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
            idParametro: 1,
            label: "texto " + textLength,
            placeholder: "Ingrese texto",
            visible: true,
            obligatorio: true,
            editable: true,
            minCaracteres: 1,
            maxCaracteres: 100,
            regex: "",
            fila: row,
            columna: column,
            idParametroGrupo: 0,
            idGrupo: this.groupData.id,
            activo: true,
          },
        ],
      })
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
            idParametro: 1,
            label: "texto " + textLength,
            placeholder: "Ingrese texto",
            visible: true,
            obligatorio: true,
            editable: true,
            minCaracteres: 1,
            maxCaracteres: 100,
            regex: "",
            fila: highestRow + 1,
            columna: 1,
            idParametroGrupo: 0,
            idGrupo: this.groupData.id,
            activo: true,
          },
        ],
      })
      .subscribe(() => {
        this._groups.loadGrupos();
        //const lastEl =
          //this.groupData.parametros[this.groupData.parametros.length - 1];
        //const el = document.getElementById(lastEl.idGrupo + lastEl.id);
        //el.scrollIntoView();
        //this.isLoading = false;
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

  drop(event: CdkDragDrop<string[]>, idx?: number) {
    if (idx !== undefined) {
      moveItemInArray(
        this.rowsOfGrid[idx],
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(
        this.groupData.parametros,
        event.previousIndex,
        event.currentIndex
      );
    }
  }*/
}
