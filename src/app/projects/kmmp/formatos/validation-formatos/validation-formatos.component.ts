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
      /*this._editarFormatoService
        .getObtenerFormatoCompleto(this.formatoId)
        .subscribe((x: any) => {
          this.data.secciones = x.body.secciones.filter(
            (seccion: any) => seccion.id === Number(this.sectionId)
          );
          this.generateForm();
          this.sectionName = this.data.secciones[0].nombre;
        });*/

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
      });
  }
  /**FIN OBTENER FORMATOS DE LA ACTIVIDAD REAL */

  /**MENU DE NAVEGACION DINAMICO */
  private setCollapsableNav(): void {
    setTimeout(() => {
      this.menuData = [
        {
          id: "formatos",
          title: "Formatos",
          type: "group",
          children: [],
        },
      ];
      this.currentActivity.map((format: any) => {
        this._editarFormatoService
          .getObtenerFormatoCompleto(format.idFormato)
          .subscribe((x: any) => {
            const format = x.body;

            this.menuData[0].children.push({
              id: x.id,
              title: format.nombre,
              type: "collapsable",
              //link: `/admin/actividades/validation/${this.currentIdActivity}/${format.id}`,
              children: [],
            });

            format.secciones.forEach((section, index) => {
              this.menuData[0].children[0].children.push({
                id: section.id,
                title: section.nombre,
                type: "basic",
                link: `/admin/actividades/validation/${this.currentIdActivity}/${format.id}/${section.id}`,
              });
            });
            this.displayNav = true;
          });
      });
    });
  }
  /**FIN MENU DE NAVEGACION DINAMICO */

  /**obtener data fake */

  /**fin obtener data fake */

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
                  value: parametro.dato,
                  disabled: true,
                })
              );
            }
          }
        });
      });
    });
  }

  edit(groupIndex: number): void {
    this.data.secciones.forEach((seccion, i) => {
      seccion.grupos.forEach((grupo, j) => {
        if (j === groupIndex) {
          this.groups[j] = !this.groups[j];
          grupo.parametros.forEach((parametro, k) => {
            if (this.editGroup[`${i}-${j}-${k}`]) {
              this.editGroup[`${i}-${j}-${k}`] = false;
              this.form
                .get(`${this.getParametroControl({ i, j, k })}`)
                .disable();
            } else {
              this.editGroup[`${i}-${j}-${k}`] = true;
              this.form
                .get(`${this.getParametroControl({ i, j, k })}`)
                .enable();
            }
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
              parametro.dato = String(
                this.form.get(this.getParametroControl({ i, j, k })).value
              );
            }
          });
        });
      });
      this._editarFormatoService
        .createDato(data.secciones[0].grupos[j])
        .subscribe(() => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key).disable();
          });
        });
    }
    e.preventDefault();
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
    const group = this.data.secciones[0].grupos.find(
      (x, index) => index === groupIdx
    );
    const data = {
      group: group,
      index: paramIdx,
    };
    this.matDialog.open(DialogAddCommentComponent, {
      width: "500px",
      data: data,
    });
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
