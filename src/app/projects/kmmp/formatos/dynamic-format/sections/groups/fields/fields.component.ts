import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AzureService } from "app/core/azure/azure.service";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { GroupI, ParamI } from "app/shared/models/formatos";
import { paramsInfo } from "app/shared/utils/dynamic-format";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ChipsSelectionComponent } from "../../../dialog-components/chips-selection/chips-selection.component";
import { OtherValidatorComponent } from "../../../dialog-components/other-validator/other-validator.component";
import { UploadImageComponent } from "../../../dialog-components/upload-image/upload-image.component";
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
  filesLoading: boolean;

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent,
    private _dialog: MatDialog,
    private _azureService: AzureService
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

  openOUploadImage(): void {
    const dialogRef = this._dialog.open(UploadImageComponent, {
      width: "450px",
    });

    dialogRef.componentInstance.data.subscribe((dato) => {
      this.paramData = {
        ...this.paramData,
        dato: dato,
      };
      this.editField("image");
      dialogRef.close();
    });
  }

  async onChageFile(event) {
    const { target } = event;
    const file = target.files[0];
    const blob = new Blob([file], { type: file.type });
    this.filesLoading = true;
    try {
      const response = await this._azureService.uploadFile(blob, file.name);
    } catch (e) {}
    this.filesLoading = false;
  }

  setImage(src: string): string {
    return this._azureService.getResourceUrlComplete(src);
  }

  openSelection(): void {
    const dialogRef = this._dialog.open(ChipsSelectionComponent, {
      width: "500px",
    });

    dialogRef.componentInstance.paramData = this.paramData;

    dialogRef.componentInstance.data.subscribe((dato) => {
      this.paramData = {
        ...this.paramData,
        dato: dato,
      };
      this.editField("selection");
      dialogRef.close();
    });
  }

  splitOptions(options: string): string[] {
    return options.split(",");
  }

  setPlaceholcer(value: string): void {}
}
