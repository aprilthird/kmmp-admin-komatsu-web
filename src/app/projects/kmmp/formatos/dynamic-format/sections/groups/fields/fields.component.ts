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
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AzureService } from "app/core/azure/azure.service";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { InputValidators } from "app/shared/config/input-validator.config";
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
  fieldData = new FormControl("", Validators.required);
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  filesLoading: boolean;
  edit: boolean;
  @ViewChild("nameInput") el: ElementRef;
  delete: any;
  editLabelField: {
    [key: string]: boolean;
  } = {};

  constructor(
    private _editarFormatoService: EditarFormatoService,
    private _groups: SectionsComponent,
    private _dialog: MatDialog,
    private _azureService: AzureService
  ) {}

  @HostListener("click", ["$event.target"])
  onClick(classname) {
    const className = (classname as Element).className;
    if (
      className ===
        "mat-tooltip-trigger text-gray-900 font-medium cursor-pointer ng-star-inserted" ||
      className === "label-edit cursor-pointer ng-star-inserted" ||
      className === "label-edit cursor-pointer"
    ) {
      this.editLabel();
    }
  }

  ngOnInit(): void {
    this.validateRegex();
  }
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

  saveLabel(type: number): void {
    this.paramData.label = this.el.nativeElement.value;
    this.editField(type);
    this.edit = !this.edit;
  }

  openOtherValidator(): void {
    const dialogRef = this._dialog.open(OtherValidatorComponent, {
      width: "450px",
    });

    dialogRef.componentInstance.success.subscribe((values) => {
      this.paramData = {
        ...this.paramData,
        regex: "",
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
    return options ? options.split(",") : [];
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

  editLabelOnField(row: number, column: number): boolean {
    return this.editLabelField[`${row}-${column}`];
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

  validateRegex(): void {
    this.fieldData.setValidators([
      this.paramData.obligatorio
        ? Validators.required
        : Validators.nullValidator,
      Validators.minLength(this.paramData.minCaracteres),
      Validators.maxLength(this.paramData.maxCaracteres),
      !this.paramData.regex || this.paramData.regex === ""
        ? Validators.nullValidator
        : this.paramData.regex === "2"
        ? Validators.email
        : Validators.pattern(/^\d{8}(?:[-\s]\d{4})?$/),
    ]);
  }

  getErrorMessage() {
    if (this.fieldData.hasError("required")) {
      return InputValidators.errorOutput.REQUIRED;
    } else {
      if (this.fieldData?.errors?.email) {
        return InputValidators.errorOutput.EMAIL;
      } else if (
        this.fieldData?.errors?.pattern &&
        this.fieldData?.errors?.pattern?.requiredPattern ===
          InputValidators.DNI_PATTERN
      ) {
        return InputValidators.errorOutput.DNI;
      } else if (
        this.fieldData?.errors?.minlength?.requiredLength ||
        this.fieldData?.errors?.maxlength?.requiredLength
      ) {
        if (this.fieldData.errors?.minlength) {
          return (
            InputValidators.errorOutput.MIN +
            this.fieldData.errors?.minlength?.requiredLength +
            InputValidators.errorOutput.ALLOWED
          );
        } else if (this.fieldData.errors?.maxlength) {
          return (
            InputValidators.errorOutput.MAX +
            this.fieldData.errors?.maxlength?.requiredLength +
            InputValidators.errorOutput.ALLOWED
          );
        }
      }
    }
  }
}
