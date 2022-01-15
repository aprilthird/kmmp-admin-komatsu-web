import { ThisReceiver } from "@angular/compiler";
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  SimpleChanges,
  AfterViewInit,
  HostListener,
} from "@angular/core";
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
export class FieldsComponent implements OnInit, AfterViewInit {
  @Input() paramData: ParamI;
  @Input() groupData: GroupI;
  @Input() lowestRow: number;
  @Input() lowestColumn: number;
  @Output() columnToDelete: EventEmitter<number> = new EventEmitter(null);
  @Output() rowToDelete: EventEmitter<number> = new EventEmitter(null);
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  filesLoading: boolean;
  edit: boolean;
  @ViewChild("nameInput") el: ElementRef;
  delete: any;

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent,
    private _dialog: MatDialog,
    private _azureService: AzureService
  ) {}

  @HostListener("click")
  editlabel() {
    this.editLabel();
  }

  @HostListener("window:click", ["$event.target"])
  onClick(classname) {
    const className = (classname as Element).className;
    if (
      className !==
      "mat-tooltip-trigger text-gray-900 font-medium cursor-pointer"
    ) {
      //this.saveLabel();
    }
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {
    this.delete = () => {
      this.columnToDelete.emit(this.paramData.columna);
    };
  }

  editField(type: number): void {
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

  saveLabel(): void {
    this.paramData.label = this.el.nativeElement.value;
    this.editField(8);
    this.edit = !this.edit;
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
      this.editField(1);
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
      this.editField(6);
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
      this.editField(10);
      dialogRef.close();
    });
  }

  splitOptions(options: string): string[] {
    return options.split(",");
  }

  setPlaceholcer(value: string): void {
    this.paramData = {
      ...this.paramData,
      placeholder: value,
    };
    this.editField(this.paramData.idParametro);
  }

  setLabel(value: string): void {
    this.paramData = {
      ...this.paramData,
      label: value,
    };
    this.editField(this.paramData.idParametro);
  }

  setAttribute(value: boolean, attribute: string): void {
    this.paramData = {
      ...this.paramData,
      [attribute]: value,
    };
    this.editField(this.paramData.idParametro);
  }

  deleteParam(): void {
    this.paramData = { ...this.paramData, activo: false };
    this.editField(this.paramData.idParametro);
  }

  editLabel(): void {
    this.edit = true;
    setTimeout(() => {
      this.el.nativeElement.select();
    });
  }

  deleteColumnRow(type: string): void {
    //this.paramData = { ...this.paramData, activo: false };
    //this.editField(this.paramData.idParametro);
    if (type === "row") {
      this.rowToDelete.emit(this.paramData.fila);
    } else {
      this.columnToDelete.emit(this.paramData.columna);
    }
  }

  save(): void {
    this.edit = false;
  }
}
