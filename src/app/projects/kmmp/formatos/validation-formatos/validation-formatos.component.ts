import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddCommentComponent } from "../components/dialog-add-comment/dialog-add-comment.component";
import { DialogValidateFormatComponent } from "../components/dialog-validate-format/dialog-validate-format.component";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

//SERVICES
import { ActivitiesService } from "../../actividades/activities.service";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";
import { FormatosService } from "../formatos.service";
import { AzureService } from "app/core/azure/azure.service";

//CONFIG
import { TipoParametro } from "app/core/types/formatos.types";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-validation-formatos",
  templateUrl: "./validation-formatos.component.html",
  styleUrls: ["./validation-formatos.component.scss"],
})
export class ValidationFormatosComponent implements OnInit {
  currentSeccion: string;
  drawerMode: "side" | "over";
  drawerOpened: boolean;
  menuData: any[];
  currentIdActivity: any;
  currentActivity: any;
  sectionId: any;
  formatoId: any;
  loading: boolean = true;
  data: any = {};

  filesLoading: {
    [key: string]: boolean;
  } = {};

  editGroup: {
    [key: string]: boolean;
  } = {};

  observation: {
    [key: string]: boolean;
  } = {};

  groups: {
    [key: string]: boolean;
  } = {};
  form: FormGroup = this.fb.group({});
  displayNav: boolean;
  sectionName: string = "";
  formats: any[] = [];
  codeActivity: string = "";
  obserForm: {
    [key: string]: boolean;
  } = {};

  constructor(
    private matDialog: MatDialog,
    private activityServices: ActivitiesService,
    private routerActive: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private fb: FormBuilder,
    private _azureService: AzureService,
    private formatosService: FormatosService
  ) {
    this.data.secciones = [];
    this.getActivityId();
    this.getActivityData();
  }

  ngOnInit(): void {
    this.drawerMode = "side";
    this.drawerOpened = true;
  }

  /**CAPTURAR ID'S DE LA ACTIVIDAD, FORMATO, SECCION */
  private getActivityId(): void {
    this.routerActive.paramMap.subscribe((params: any) => {
      this.currentIdActivity = params.params["idActivity"];
      this.sectionId = params.params["idSection"];
      this.formatoId = params.params["idFormat"];

      this._editarFormatoService
        .getAbrirAsignacion(this.formatoId)
        .subscribe((x: any) => {
          this.data.secciones = x.body.secciones.filter(
            (seccion: any) => seccion.id === Number(this.sectionId)
          );
          this.generateForm();
          this.sectionName = this.data.secciones[0].nombre;
        });
    });
  }

  validateSection(): boolean {
    return this.data.secciones[0].grupos[0].parametros[0].seccionValida;
  }

  validateFormat(): boolean {
    return this.data.secciones[0].grupos[0].parametros[0].formatoValido;
  }

  /** FIN CAPTURAR ID'S DE LA ACTIVIDAD, FORMATO, SECCION */

  /**OBTENER FORMATOS DE LA ACTIVIDAD REAL */
  private getActivityData(): void {
    this.activityServices
      .getActivity(this.currentIdActivity)
      .subscribe((activity: any) => {
        this.currentActivity = activity.body.formatos;
        this.setCollapsableNav();
        this.codeActivity = activity.body.codigo;
      });
  }
  /**FIN OBTENER FORMATOS DE LA ACTIVIDAD REAL */

  /**MENU DE NAVEGACION DINAMICO */
  private setCollapsableNav() {
    setTimeout(async () => {
      this.menuData = [
        {
          id: "formatos",
          title: "Formatos",
          type: "group",
          children: [],
        },
      ];
      this.getMenuData();
      setTimeout(() => {
        this.formats.forEach((format: any, idx) => {
          console.log(format);
          this.menuData[0].children.unshift({
            id: format.id,
            title: format.nombre ? format.nombre : "Formato " + (idx + 1),
            type: "collapsable",
            children: [],
          });

          format.secciones.forEach((section, index) => {
            this.menuData[0].children[0].children.push({
              id: section.id,
              title: section.nombre,
              type: "basic",
              link: `/admin/actividades/validation/${this.currentIdActivity}/${format.idAsignacionFormato}/${section.id}`,
            });
          });

          setTimeout(() => {
            this.displayNav = true;
          });
        });
      }, 2500);
    });
  }

  getMenuData(): void {
    this.currentActivity.map((format: any) => {
      this._editarFormatoService
        .getAbrirAsignacion(format.idActividadFormato)
        .subscribe((x: any) => {
          this.formats.push(x.body);
        });
    });
  }

  checkInformValidated(): boolean {
    this.formats.forEach((format) => {
      format.secciones.forEach((section) => {
        if (!section.grupos[0].parametros[0].seccionValida) return false;
      });
    });
    return true;
  }
  /**FIN MENU DE NAVEGACION DINAMICO */

  /**************************OBTENER/GESTIONS ASIGNACION********************************* */
  /**/

  generateForm() {
    this.data.secciones.forEach((seccion, i) => {
      seccion.grupos.forEach((grupo, j) => {
        this.observation[`${j}`] = false;
        grupo.parametros.forEach((parametro, k) => {
          if (parametro.activo) {
            if (
              parametro.idParametro === TipoParametro.UPLOAD ||
              parametro.idParametro === TipoParametro.IMAGEN ||
              parametro.idParametro === TipoParametro.FIRMA
            ) {
              this.filesLoading[`${i}-${j}-${k}`] = false;
            }
            if (parametro.idParametro === TipoParametro.CHECKBOX) {
              this.form.addControl(
                `${this.getParametroControl({ i, j, k })}`,
                new FormControl({
                  value: parametro.valor === "true" ? true : false,
                  disabled: true,
                })
              );
            } else {
              this.form.addControl(
                `${this.getParametroControl({ i, j, k })}`,
                new FormControl({
                  value: parametro.valor,
                  disabled: true,
                })
              );
            }

            /**OBSERVE PARAM */

            this.obserForm[`${this.getParametroControl({ i, j, k })}`] = true
              ? parametro.observar
              : false;
          }
        });
      });
    });
  }

  isObserve(i, j, k) {
    return this.obserForm[`${i}-${j}-${k}`];
  }
  observeToolTip(i, j, k) {
    if (this.obserForm[`${i}-${j}-${k}`]) {
      return "Campo ha sido observado";
    }
    return "Campo no ha sido observado aún";
  }
  edit(groupIndex: number): void {
    this.data.secciones.forEach((seccion, i) => {
      seccion.grupos.forEach((grupo, j) => {
        if (j === groupIndex) {
          this.groups[j] = !this.groups[j];
          grupo.parametros.forEach((parametro, k) => {
            this.editGroup[`${i}-${j}-${k}`] = true;
            this.form.get(`${this.getParametroControl({ i, j, k })}`).enable();
          });
        }
      });
    });
  }

  onSubmit(e: MouseEvent, j: number): void {
    if (this.form.valid) {
      const data = { ...this.data };

      data.secciones.forEach((seccion, i) => {
        seccion.grupos.forEach((grupo, j) => {
          this.groups[j] = !this.groups[j];
          grupo.parametros.forEach((parametro, k) => {
            if (parametro.activo) {
              if (
                parametro.idParametro === TipoParametro.UPLOAD ||
                parametro.idParametro === TipoParametro.IMAGEN
              ) {
                if (parametro.valor === null || parametro.valor === "") {
                  this.form
                    .get(this.getParametroControl({ i, j, k }))
                    .setValue(parametro.dato);
                }
              }
              parametro.valor = String(
                this.form.get(this.getParametroControl({ i, j, k })).value
              );
            }
          });
        });
      });

      this._editarFormatoService.saveAssignation(data).subscribe(() => {
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key).disable();
        });
      });
    }
    e.preventDefault();
  }

  cancelEdit(j): void {
    this.groups[j] = false;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key).disable();
    });
  }

  setImage(src: string): string {
    return this._azureService.getResourceUrlComplete(src);
  }

  getParametroControl({ i, j, k }) {
    return `${i}-${j}-${k}`;
  }

  getEditButton({ i, j, k }) {
    return this.editGroup[`${j}`];
  }

  getErrorMessage(input: string) {
    const control = this.form.get(input);

    if (control.hasError("required")) {
      return "Campo requerido";
    }

    if (control.hasError("minlength")) {
      return `Debe tener mínimo ${control.errors.minlength.requiredLength}`;
    }

    if (control.hasError("maxlength")) {
      return `Debe tener máximo ${control.errors.maxlength.requiredLength}`;
    }

    if (control.hasError("pattern")) {
      return `Formato incorrecto`;
    }

    return control.hasError("email") ? "Formato de correo incorrecto" : "";
  }

  splitOptions(options: string): string[] {
    return options.split(",");
  }

  getFirstOption(options: string): string {
    return options.split(",")[0];
  }

  async onChageFile(event: any, control: string) {
    if (event) {
      const { target } = event;
      const file = target.files[0];
      const blob = new Blob([file], { type: file.type });
      this.filesLoading[`${control}`] = true;
      try {
        const response = await this._azureService.uploadFile(blob, file.name);
        this.form.get(control).setValue(response.uuidFileName);
      } catch (e) {}
      this.filesLoading[`${control}`] = false;
    } else {
      this.form.get(control).setValue("");
    }
  }

  clickOpenFile(resourceName) {
    window.open(
      this._azureService.getResourceUrlComplete(resourceName),
      "blank"
    );
  }

  validate(): void {
    const idAsignacionDetalle =
      this.data.secciones[0].grupos[0].parametros[0].idAsignacionDetalle;
    const idSeccion = this.data.secciones[0].grupos[0].parametros[0].idSeccion;

    const data = {
      idAsignacionDetalle: idAsignacionDetalle,
      idSeccion: idSeccion,
    };
    this.matDialog.open(DialogValidateFormatComponent, {
      width: "500px",
      data: data,
    });
  }

  addComment(groupIdx: number, paramIdx: number): void {
    /*const group = this.data.secciones[0].grupos.find(
      (x, index) => index === groupIdx
    );
    const data = {
      group: group,
      index: paramIdx,
    };*/

    const data = {
      data: this.data,
      groupIndex: groupIdx,
      paramIndex: paramIdx,
    };
    this.matDialog
      .open(DialogAddCommentComponent, {
        width: "500px",
        data: data,
      })
      .afterClosed()
      .subscribe(() =>
        Object.keys(this.observation).forEach(
          (key) => (this.observation[key] = false)
        )
      );
  }

  postValidateFormat(): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Validación de informe",
      message: "¿Estás seguro que desea validar el informe?",

      actions: {
        confirm: {
          label: "Sí, validar",
          color: "primary",
        },
        cancel: {
          label: "No",
        },
      },
      dismissible: true,
    });

    dialogRef.beforeClosed().subscribe((result) => {
      const data = {
        idAsignacionDetalle:
          this.data.secciones[0].grupos[0].parametros[0].idAsignacionDetalle,
        idFormato: this.data.secciones[0].grupos[0].parametros[0].idFormato,
      };
      if (result === "confirmed") {
        this.formatosService.validateFormat(data).subscribe(() => {});
      }
    });
  }

  deleteComment(): void {}
}
