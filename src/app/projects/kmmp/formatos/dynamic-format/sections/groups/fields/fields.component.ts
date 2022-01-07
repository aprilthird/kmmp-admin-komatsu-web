import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { GroupI, ParamI } from "app/shared/models/formatos";
import { paramsInfo } from "app/shared/utils/dynamic-format";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OtherValidatorComponent } from "../../../dialog-components/other-validator/other-validator.component";
import { SectionsComponent } from "../../sections.component";

@Component({
  selector: "app-fields",
  templateUrl: "./fields.component.html",
  styleUrls: ["./fields.component.scss"],
})
export class FieldsComponent implements OnInit {
  @Input() paramData: ParamI;
  @Input() groupData: GroupI;
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  editField(type: any): void {
    this.isLoading = true;
    this._editarFormatoService
      .createDato({
        ...this.groupData,
        parametros: [
          {
            ...this.paramData,
            ...paramsInfo(type, this.paramData),
          },
        ],
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._groups.loadGrupos();
        this.isLoading = false;
      });
  }

  openOtherValidator(): void {
    const dialogRef = this._dialog.open(OtherValidatorComponent, {
      width: "450px",
    });

    dialogRef.componentInstance.success.subscribe((values) => {
      this.paramData = {
        ...this.paramData,
        minCaracteres: values.min,
        maxCaracteres: values.max,
      };
      this.editField("text");
      dialogRef.close();
    });
  }
}
