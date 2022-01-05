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
export class GroupsComponent implements OnInit, OnChanges {
  @Input() groupData: any;
  isLoading: boolean;
  initCount: number;
  rows = [];

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent
  ) {}

  ngOnInit(): void {
    const rowOne = [...this.groupData.parametros].filter(
      (param) => param.fila === 1
    );
    const rowTwo = [...this.groupData.parametros].filter(
      (param) => param.fila === 2
    );
    this.rows.push(rowOne);
    this.rows.push(rowTwo);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.groupData = changes.groupData.currentValue;
  }

  async postParam() {
    this.isLoading = true;
    const rows = await this.groupData.parametros.map((data) => data.fila);
    const highestRow = Math.max.apply(null, rows);
    const textLength = this.groupData.parametros.length + 1;
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
            idParametroGrupo: 0,
            idGrupo: this.groupData.id,
            activo: true,
          },
        ],
      })
      .subscribe(() => {
        this._groups.loadGrupos();
        const lastEl =
          this.groupData.parametros[this.groupData.parametros.length - 1];
        const el = document.getElementById(lastEl.label + lastEl.id);
        el.scrollIntoView();
        this.isLoading = false;
      });
  }

  drop(event: CdkDragDrop<string[]>, idx?: number) {
    if (idx !== undefined) {
      console.log(this.rows[idx]);
      moveItemInArray(this.rows[idx], event.previousIndex, event.currentIndex);
    } else {
      moveItemInArray(
        this.groupData.parametros,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
