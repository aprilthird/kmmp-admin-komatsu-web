import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AzureService } from "app/core/azure/azure.service";
import { PermissionService } from "app/core/permission/permission.service";
import { TipoParametro } from "app/core/types/formatos.types";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { environment } from "environments/environment";

import { ActivitiesService } from "../../actividades/activities.service";
import { DialogAddCommentComponent } from "../components/dialog-add-comment/dialog-add-comment.component";
import { DialogValidateFormatComponent } from "../components/dialog-validate-format/dialog-validate-format.component";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";
import { FormatosService } from "../formatos.service";

//SERVICES
//CONFIG
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
  loaded: boolean;
  data: any = {};
  allSectionValidates = [];

  filesLoading: {
    [key: string]: boolean;
  } = {};

  editGroup: {
    [key: string]: boolean;
  } = {};

  submitEditGroup: {
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

  sections: any[] = [];
  currentSectionData: any;
  loadingReport: boolean;

  constructor(
    private matDialog: MatDialog,
    private activityServices: ActivitiesService,
    private routerActive: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private fb: FormBuilder,
    private _azureService: AzureService,
    private formatosService: FormatosService,
    public _permissonService: PermissionService
  ) {
    this.data.secciones = [{}];
    this.getActivityId();
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
        .subscribe(async (x: any) => {
          this.sections = await x.body.secciones;
          this.data = x.body;
          if (this.sections[0].grupos && this.sections[0].grupos.length > 0) {
            this.getActivityData();
          } else {
            this.matDialog.open(UiDialogsComponent, {
              width: "500px",
              data: {
                message: "No existe información en el actual formato!",
                title: "Error",
                action: "redirect",
                url: "admin/actividades/list",
              },
            });
          }

          if (this.sectionId) {
            this.currentSectionData = await [...this.sections].find(
              (section: any) => Number(this.sectionId) === section.id
            );
            this.generateForm();
            this.sectionName = this.sections[0].nombre;
          }
        });
    });
  }

  validateSection(): boolean {
    return this.currentSectionData.grupos[0].parametros.some(
      (parametro) => parametro.seccionValida
    );
  }

  isSectionObserved(): boolean {
    const groups = this.currentSectionData.grupos.map((group) => group);

    const params = groups.map((group) =>
      group.parametros.some((param) => param.observar)
    );

    return params.some((x) => x);
  }

  validateFormat() {
    for (let i = 0; i < this.sections.length; i++) {
      for (let j = 0; j < this.sections[i].grupos[0].parametros.length; j++) {
        if (this.sections[i].grupos[0].parametros[j].formatoValido) {
          return true;
        }
      }
    }
    return false;
  }

  /*validateFormat(): boolean {
    if (this.sections[0].grupos[0].parametros.length > 0) {
      return this.sections[0].grupos[0].parametros[0].formatoValido;
    }
    return false;
  }*/

  /** FIN CAPTURAR ID'S DE LA ACTIVIDAD, FORMATO, SECCION */

  /**OBTENER FORMATOS DE LA ACTIVIDAD REAL */
  private getActivityData(): void {
    this.activityServices
      .getActivity(this.currentIdActivity)
      .subscribe((activity: any) => {
        this.currentActivity = activity.body.formatos;
        setTimeout(() => {
          this.setCollapsableNav();
          this.loaded = true;
        }, 1500);

        this.codeActivity = activity.body.codigo;
      });
  }
  /**FIN OBTENER FORMATOS DE LA ACTIVIDAD REAL */

  /**MENU DE NAVEGACION DINAMICO */
  /*private setCollapsableNav() {
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
              badge: {
                title: !section.grupos[0].parametros[0].seccionValida
                  ? "warning_amber"
                  : "heroicons_outline:check-circle",
                classes: !section.grupos[0].parametros[0].seccionValida
                  ? "text-gray-600"
                  : "text-green-600",
              },
            });
          });

          setTimeout(() => {
            this.displayNav = true;
          });
        });
      }, 2500);
    });
  }*/

  private setCollapsableNav(): void {
    this.allSectionValidates = [];
    this.menuData = [
      {
        id: "secciones",
        title: "Secciones",
        type: "group",
        children: [],
      },
    ];
    this.sections.forEach((section, index) => {
      if (
        section.grupos[0].parametros.some(
          (parametro) => parametro.seccionValida
        )
      ) {
        this.allSectionValidates.push(true);
      }

      const params = section.grupos.map((group) =>
        group.parametros.some((param) => param.observar)
      );
      this.menuData[0].children.push({
        id: section.id,
        title: section.nombre,
        type: "basic",
        link: `/admin/actividades/validation/${this.currentIdActivity}/${this.formatoId}/${section.id}`,
        children: [],
        badge: {
          title:
            !section.grupos[0].parametros.some(
              (parametro) => parametro.seccionValida
            ) && params.some((x) => x)
              ? "warning_amber"
              : section.grupos[0].parametros.some(
                  (parametro) => parametro.seccionValida
                )
              ? "heroicons_outline:check-circle"
              : "",
          classes: params.some((x) => x) ? "text-yellow-600" : "text-green-600",
        },
      });
    });

    this.validateFormat();
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
        if (section.grupos[0].parametros.length > 0) {
          if (!section.grupos[0].parametros[0].seccionValida) return false;
        } else {
          return false;
        }
      });
    });
    return true;
  }
  /**FIN MENU DE NAVEGACION DINAMICO */

  /**************************OBTENER/GESTIONS ASIGNACION********************************* */
  /**/

  generateForm() {
    this.sections.forEach((seccion, i) => {
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
                `${this.getParametroControl({ j, k })}`,
                new FormControl({
                  value: parametro.valor === "true" ? true : false,
                  disabled: true,
                })
              );
            } else if (parametro.idParametro === TipoParametro.FECHA) {
              this.form.addControl(
                `${this.getParametroControl({ j, k })}`,
                new FormControl({
                  value: this.convertDate(parametro.valor),
                  disabled: true,
                })
              );
            } else {
              this.form.addControl(
                `${this.getParametroControl({ j, k })}`,
                new FormControl({
                  value: parametro.valor,
                  disabled: true,
                })
              );
            }

            /**OBSERVE PARAM */

            this.obserForm[`${this.getParametroControl({ j, k })}`] = true
              ? parametro.observar
              : false;
          }
        });
      });
    });
  }

  isObserve(j, k) {
    return this.obserForm[`${j}-${k}`];
  }
  observeToolTip(j, k) {
    if (this.obserForm[`${j}-${k}`]) {
      return "Campo ha sido observado";
    }
    return "Campo no ha sido observado aún";
  }
  edit(groupIndex: number): void {
    this.currentSectionData.grupos.forEach((grupo, j) => {
      if (j === groupIndex) {
        this.groups[j] = !this.groups[j];
        grupo.parametros.forEach((parametro, k) => {
          this.editGroup[`${j}`] = true;
          if (this.form.controls[`${this.getParametroControl({ j, k })}`]) {
            this.form.get(`${this.getParametroControl({ j, k })}`).enable();
          }
        });
      }
    });
  }

  editable(j): boolean {
    return this.groups[`${j}`];
  }

  onSubmit(e: MouseEvent, indexGroup: number, paramIdx?: number): void {
    this.submitEditGroup[`${indexGroup}`] = true;
    const data = [...this.sections];

    data.forEach((seccion, i) => {
      seccion.grupos.forEach((grupo, j) => {
        if (indexGroup === j) {
          this.groups[j] = false;
        }

        grupo.parametros.forEach((parametro, k) => {
          if (parametro.activo) {
            if (
              parametro.idParametro === TipoParametro.UPLOAD ||
              parametro.idParametro === TipoParametro.IMAGEN
            ) {
              this.checkImgParam(parametro, j, k);
            } else if (parametro.idParametro === TipoParametro.FIRMA) {
              this.checkSignParam(paramIdx, parametro, indexGroup, k, j);
            } else {
              parametro.valor = String(
                this.form.get(this.getParametroControl({ j, k })).value
              );
            }
          }
        });
      });
    });

    const payload = {
      secciones: data,
      idFormato: data[0].grupos[0].parametros[0].idFormato,
      idActividadFormtao: Number(this.formatoId),
    };

    this._editarFormatoService.saveAssignation(payload).subscribe(() => {
      this.submitEditGroup[`${indexGroup}`] = false;
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key).disable();
      });
    });
    e.preventDefault();
  }

  checkImgParam(parametro, j, k): void {
    parametro.valor = String(
      this.form.get(this.getParametroControl({ j, k })).value
    );
    if (!parametro.valor || parametro.valor === "") {
      this.form
        .get(this.getParametroControl({ j, k }))
        .setValue(parametro.dato);
    }
  }

  checkSignParam(paramIdx, parametro, indexGroup, k, j): void {
    if (paramIdx) {
      if (paramIdx === k && indexGroup === j) {
        parametro.valor = null;
        this.form.get(this.getParametroControl({ j, k })).setValue(null);
      }
    } else {
      if (
        this.form.get(this.getParametroControl({ j, k })).value &&
        this.form.get(this.getParametroControl({ j, k })).value !== ""
      ) {
        parametro.valor = String(
          this.form.get(this.getParametroControl({ j, k })).value
        );
      } else {
        parametro.valor = null;
      }
    }
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

  getParametroControl({ j, k }) {
    return `${j}-${k}`;
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

  /*validate(): void {
    const idAsignacionDetalle =
      this.sections[0].grupos[0].parametros[0].idAsignacionDetalle;
    const idSeccion = this.sections[0].grupos[0].parametros[0].idSeccion;

    const data = {
      idAsignacionDetalle: idAsignacionDetalle,
      idSeccion: idSeccion,
    };
    this.matDialog.open(DialogValidateFormatComponent, {
      width: "500px",
      data: data,
    });
  }*/

  validate(): void {
    const idAsignacionDetalle =
      this.currentSectionData.grupos[0].parametros[0].idAsignacionDetalle;
    const idSeccion = this.currentSectionData.grupos[0].parametros[0].idSeccion;

    const data = {
      idAsignacionDetalle: idAsignacionDetalle,
      idSeccion: idSeccion,
    };
    const dialogRef = this.matDialog.open(DialogValidateFormatComponent, {
      width: "500px",
      data: data,
    });

    dialogRef.componentInstance.success.subscribe((resp) => {
      if (resp.code === 200 || resp.success) {
        this.currentSectionData.grupos[0].parametros[0].seccionValida = true;
        this.validateSection();
        this.setCollapsableNav();
      } else {
        this.matDialog
          .open(UiDialogsComponent, {
            width: "500px",
            data: {
              title: "Error",
              message: resp.message,
            },
          })
          .afterClosed()
          .subscribe(() => this.setCollapsableNav());
      }

      dialogRef.close(close);
    });
  }

  addComment(groupIdx: number, paramIdx: number, comment): void {
    const data = {
      data: { ...this.data, idActividadFormato: Number(this.formatoId) },
      groupIndex: groupIdx,
      paramIndex: paramIdx,
      sectionId: this.sectionId,
      formatoId: this.formatoId,
      comment: comment,
    };
    this.matDialog
      .open(DialogAddCommentComponent, {
        width: "500px",
        data: data,
      })
      .afterClosed()
      .subscribe(() => {
        Object.keys(this.observation).forEach(
          (key) => (this.observation[key] = false)
        );

        this.observeToolTip(groupIdx, paramIdx);
      });
  }

  /*postValidateFormat(): void {
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
          this.sections[0].grupos[0].parametros[0].idAsignacionDetalle,
        idFormato: this.sections[0].grupos[0].parametros[0].idFormato,
      };
      if (result === "confirmed") {
        this.formatosService.validateFormat(data).subscribe(() => {});
      }
    });
  }*/

  postValidateFormat(): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Validación de formato",
      message: "¿Estás seguro que desea validar el formato?",

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
          this.sections[0].grupos[0].parametros[0].idAsignacionDetalle,
        idFormato: this.sections[0].grupos[0].parametros[0].idFormato,
      };

      if (result === "confirmed") {
        this.formatosService.validateFormat(data).subscribe(() => {
          this.sections[0].grupos[0].parametros[0].formatoValido = true;
        });
      }
    });
  }

  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  removeSign(event, groupIdx: number, paramIdx: number): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Eliminar firma",
      message: "¿Estás seguro que desea eliminar permanentemente la firma?",

      actions: {
        confirm: {
          label: "Sí, eliminar",
          color: "primary",
        },
        cancel: {
          label: "No",
        },
      },
      dismissible: true,
    });

    dialogRef.beforeClosed().subscribe((result) => {
      if (result === "confirmed") {
        this.onSubmit(event, groupIdx, paramIdx);
      }
    });
  }

  printPdf(): void {
    this.loadingReport = true;
    fetch(
      environment.apiUrl + "/Reportes/GenerarInforme/" + Number(this.formatoId)
    )
      .then((resp) => resp.blob())
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "Asignacion_" + this.formatoId + ".pdf";
        document.body.appendChild(a);
        this.loadingReport = false;
        a.click();
        a.remove();
      })
      .catch((e) =>
        this.matDialog.open(UiDialogsComponent, {
          data: {
            title: "Error",
            message: "No hay contenido para generar reporte",
          },
        })
      );
  }
}
