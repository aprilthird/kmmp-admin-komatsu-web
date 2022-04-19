import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AzureService } from "app/core/azure/azure.service";
import { PermissionService } from "app/core/permission/permission.service";
import { TipoParametro } from "app/core/types/formatos.types";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { Estados } from "app/shared/config/codigos";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { environment } from "environments/environment";
import { Moment } from "moment";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ActivitiesService } from "../../actividades/activities.service";
import { DialogAddCommentComponent } from "../components/dialog-add-comment/dialog-add-comment.component";
import { DialogValidateFormatComponent } from "../components/dialog-validate-format/dialog-validate-format.component";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";
import { FormatosService } from "../formatos.service";

@Component({
  selector: "app-validation-formatos",
  templateUrl: "./validation-formatos.component.html",
  styleUrls: ["./validation-formatos.component.scss"],
})
export class ValidationFormatosComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
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
  asignation: any;
  groupTitles: FormGroup = this.fb.group({});
  @ViewChildren("textareainfo") el: QueryList<ElementRef>;

  titleEleHeight: {
    [key: string]: number;
  } = {};
  rendered: boolean;
  userId: number;
  initialData: any;

  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private matDialog: MatDialog,
    private activityServices: ActivitiesService,
    private routerActive: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private fb: FormBuilder,
    private _azureService: AzureService,
    private formatosService: FormatosService,
    public _permissonService: PermissionService,
    private _route: Router,
    private _userService: UserService,
    private _httpClient: HttpClient
  ) {
    this.dateFormats.display.dateInput = "DD/MM/YYYY";
    this.data.secciones = [{}];
    this.getActivityId();
  }

  ngOnInit(): void {
    this.drawerMode = "side";
    this.drawerOpened = true;
    this.getIdUser();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getIdUser(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.userId = Number(user.id);
      });
  }

  /**CAPTURAR ID'S DE LA ACTIVIDAD, FORMATO, SECCION */
  private getActivityId(): void {
    this.routerActive.paramMap.subscribe((params: any) => {
      this.loaded = false;
      this.currentIdActivity = params.params["idActivity"];
      this.sectionId = params.params["idSection"];
      this.formatoId = params.params["idFormat"];

      if (!this.rendered) {
        this.getAsignation();
        this.rendered = true;
      } else {
        this.currentSectionData = [...this.sections].find(
          (section: any) => Number(this.sectionId) === section.id
        );
        this.generateForm();
        this.sectionName = this.sections[0].nombre;
        setTimeout(() => {
          this.setCollapsableNav();
        }, 500);
      }
    });
  }

  private getAsignation(): void {
    this._editarFormatoService
      .getAbrirAsignacion(this.formatoId)
      .subscribe(async (x: any) => {
        this.asignation = await x.body;
        this.sections = await x.body.secciones.filter(
          (section) => section.activo
        );
        this.data = x.body;
        if (this.sections[0].grupos && this.sections[0].grupos.length > 0) {
          if (this.sectionId && this.sectionId !== "0") {
            this.currentSectionData = await [...this.sections].find(
              (section: any) => Number(this.sectionId) === section.id
            );
          } else {
            this.currentSectionData = this.sections[0];

            this._route.navigate([
              `/admin/actividades/validation/`,
              String(this.currentIdActivity),
              String(this.formatoId),
              String(this.sections[0].id),
            ]);
          }
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

        this.generateForm();
        this.sectionName = this.sections[0].nombre;
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

  /**OBTENER FORMATOS DE LA ACTIVIDAD REAL */
  private getActivityData(): void {
    this.activityServices
      .getActivity(this.currentIdActivity)
      .subscribe((activity: any) => {
        this.currentActivity = activity.body.formatos;
        setTimeout(() => {
          this.setCollapsableNav();

          //this.loaded = true;
        }, 1500);

        this.codeActivity = activity.body.codigo;
      });
  }

  private setCollapsableNav(): void {
    const i = this.currentSectionData.id;
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

      section.grupos.forEach((grupo, j) => {
        setTimeout(() => {
          if (this.el["_results"][j]) {
            this.titleEleHeight[j] = this.el["_results"][
              j
            ].nativeElement.scrollHeight
              .toString()
              .concat("px");
          }
        }, 100);
        this.groups[j] = false;
        grupo.parametros.forEach((parametro, k) => {
          if (this.form.get(`${this.getParametroControl({ i, j, k })}`)) {
            this.form.get(`${this.getParametroControl({ i, j, k })}`).disable();
          }
        });
      });

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
    this.loaded = true;
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
    this.form = this.fb.group({});
    this.groupTitles = this.fb.group({});
    const idx = this.currentSectionData.index - 1;
    this.sections.forEach((seccion, i) => {
      if (i === idx) {
        seccion.grupos.forEach((grupo, j) => {
          this.groupTitles.addControl(
            `${this.getGroupControl({ j })}`,
            new FormControl(grupo?.titulo)
          );

          this.observation[`${j}`] = false;
          grupo.parametros.forEach((parametro, k) => {
            if (parametro.activo) {
              if (parametro.idParametro === TipoParametro.CHECKBOX) {
                this.form.addControl(
                  `${this.getParametroControl({ i, j, k })}`,
                  new FormControl({
                    value: parametro.valor === "true" ? true : false,
                    disabled: true,
                  })
                );
              } else if (parametro.idParametro === TipoParametro.FECHA) {
                this.form.addControl(
                  `${this.getParametroControl({ i, j, k })}`,
                  new FormControl({
                    //value: this.convertDate(parametro.valor),
                    value: parametro.valor,
                    disabled: true,
                  })
                );
              } else if (
                parametro.idParametro === TipoParametro.TEXTO ||
                parametro.idParametro === TipoParametro.AREA_TEXTO ||
                parametro.idParametro === TipoParametro.NUMERICO ||
                parametro.idParametro === TipoParametro.FECHA
              ) {
                this.form.addControl(
                  `${this.getParametroControl({ i, j, k })}`,
                  new FormControl(
                    {
                      value: parametro.valor,
                      disabled: true,
                    },
                    [
                      parametro.obligatorio
                        ? Validators.required
                        : Validators.nullValidator,
                      Validators.minLength(
                        parametro.minCaracteres ? parametro.minCaracteres : 0
                      ),
                      Validators.maxLength(
                        parametro.maxCaracteres
                          ? parametro.maxCaracteres
                          : undefined
                      ),
                      !parametro.regex || parametro.regex === ""
                        ? Validators.nullValidator
                        : parametro.regex === "2"
                        ? Validators.email
                        : Validators.pattern(/^\d{8}(?:[-\s]\d{4})?$/),
                    ]
                  )
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
            }
          });
        });
      }
    });

    this.initialData = { ...this.form };
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
    const i = this.currentSectionData.index - 1;

    this.sections.forEach((section, i) => {
      section.grupos.forEach((grupo, j) => {
        grupo.parametros.forEach((parametro, k) => {
          if (this.form.controls[`${this.getParametroControl({ i, j, k })}`]) {
            this.form.get(`${this.getParametroControl({ i, j, k })}`).disable();
          }
        });
      });
    });

    this.currentSectionData.grupos.forEach((grupo, j) => {
      if (j === groupIndex) {
        this.groups[j] = true;
        grupo.parametros.forEach((parametro, k) => {
          if (
            this.form.controls[`${this.getParametroControl({ i, j, k })}`] &&
            parametro.editable
          ) {
            this.form.get(`${this.getParametroControl({ i, j, k })}`).enable();
          }
        });
      } else {
        this.groups[j] = false;
        grupo.parametros.forEach((parametro, k) => {
          if (
            this.form.controls[`${this.getParametroControl({ i, j, k })}`] &&
            parametro.editable
          ) {
            this.form.get(`${this.getParametroControl({ i, j, k })}`).disable();
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
    const idx = this.currentSectionData.index - 1;
    const data = [...this.sections];

    data.forEach((seccion, i) => {
      if (i === idx) {
        seccion.grupos.forEach((grupo, j) => {
          grupo.titulo = this.groupTitles.get(
            this.getGroupControl({ j })
          ).value;
          if (indexGroup === j) {
            this.groups[j] = false;
          }

          grupo.parametros.forEach((parametro, k) => {
            if (parametro.activo) {
              if (
                parametro.idParametro === TipoParametro.IMAGEN ||
                parametro.idParametro === TipoParametro.UPLOAD ||
                parametro.idParametro === TipoParametro.FIRMA
              ) {
                this.checkImgParam(parametro, j, k);
              } else if (parametro.idParametro === TipoParametro.FECHA) {
                if (
                  typeof this.form.get(this.getParametroControl({ i, j, k }))
                    .value === "object"
                ) {
                  if (parametro.valor !== null) {
                    if (parametro.valor.indexOf("function") > -1) {
                      if (
                        this.form.get(this.getParametroControl({ i, j, k }))
                          .value === null
                      ) {
                        parametro.valor = null;
                      } else {
                        parametro.valor = this.convertDate(
                          this.form.get(this.getParametroControl({ i, j, k }))
                            .value
                        );
                      }
                    } else {
                      if (parametro.valor !== "") {
                        parametro.valor = this.convertDate(
                          this.form.get(this.getParametroControl({ i, j, k }))
                            .value
                        );
                      } else {
                        if (
                          typeof this.form.get(
                            this.getParametroControl({ i, j, k })
                          ).value === "object"
                        ) {
                          parametro.valor = this.convertDate(
                            this.form.get(this.getParametroControl({ i, j, k }))
                              .value
                          );
                        } else {
                          parametro.valor = null;
                        }
                      }
                    }
                  } else {
                    if (
                      this.form.get(this.getParametroControl({ i, j, k }))
                        .value === null
                    ) {
                      parametro.valor = null;
                    } else {
                      parametro.valor = this.convertDate(
                        this.form.get(this.getParametroControl({ i, j, k }))
                          .value
                      );
                    }
                  }
                } else {
                  parametro.valor = this.form.get(
                    this.getParametroControl({ i, j, k })
                  ).value;
                }
              } else if (parametro.idParametro !== TipoParametro.LABEL) {
                if (this.form.get(this.getParametroControl({ i, j, k }))) {
                  parametro.valor = String(
                    this.form.get(this.getParametroControl({ i, j, k })).value
                  );
                }
              }

              if (
                this.initialData.value[`${i}-${j}-${k}`].toString() !==
                parametro.valor.toString()
              ) {
                parametro.idUsuarioMod =
                  parametro?.idUsuarioReg !== 0
                    ? this.userId
                    : parametro?.idUsuarioMod;

                parametro.idUsuarioReg =
                  parametro?.idUsuarioReg !== 0
                    ? parametro?.idUsuarioReg
                    : this.userId;
              }
            }
          });
        });
      }
    });

    const payload = {
      ...this.asignation,
      secciones: data,
      idFormato: data[0].grupos[0].parametros[0].idFormato,
      idActividadFormato: Number(this.formatoId),
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
    const i = this.currentSectionData.index - 1;
    if (this.form.get(this.getParametroControl({ i, j, k }))) {
      parametro.valor = String(
        this.form.get(this.getParametroControl({ i, j, k })).value
      );

      if (
        !parametro.valor ||
        parametro.valor === "" ||
        parametro.valor === "null"
      ) {
        if (parametro.dato) {
          this.form
            .get(this.getParametroControl({ i, j, k }))
            .setValue(parametro.dato);
        } else {
          this.form
            .get(this.getParametroControl({ i, j, k }))
            .setValue(undefined);
        }
      }
    }
  }

  checkSignParam(paramIdx, parametro, indexGroup, k, j): void {
    const i = this.currentSectionData.index - 1;
    if (this.form.get(this.getParametroControl({ i, j, k }))) {
      if (typeof paramIdx === "number") {
        if (paramIdx === k && indexGroup === j) {
          parametro.valor = null;
          this.form.get(this.getParametroControl({ i, j, k })).setValue(null);
        }
      } else {
        if (
          this.form.get(this.getParametroControl({ i, j, k })).value &&
          this.form.get(this.getParametroControl({ i, j, k })).value !== ""
        ) {
          parametro.valor = String(
            this.form.get(this.getParametroControl({ i, j, k })).value
          );
        } else {
          parametro.valor = null;
        }
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

  getParametroControl({ i, j, k }) {
    return `${String(i)}-${j}-${k}`;
  }

  getGroupControl({ j }) {
    return String(j);
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

  addComment(groupIdx: number, paramIdx: number, comment) {
    this.submitEditGroup[`${groupIdx}`] = true;
    const data = {
      data: {
        ...this.data,
        idActividadFormato: Number(this.formatoId),
        estado: Estados.OBSERVADA,
      },
      groupIndex: groupIdx,
      paramIndex: paramIdx,
      sectionId: this.sectionId,
      formatoId: this.formatoId,
      comment: comment,
    };
    const dialog = this.matDialog.open(DialogAddCommentComponent, {
      width: "500px",
      data: data,
    });
    dialog.componentInstance.respCommetRequest.subscribe((resp) => {
      this.submitEditGroup[`${groupIdx}`] = false;
      Object.keys(this.observation).forEach(
        (key) => (this.observation[key] = false)
      );
      this.observeToolTip(groupIdx, paramIdx);
    });

    dialog
      .afterClosed()
      .subscribe(() => (this.submitEditGroup[`${groupIdx}`] = false));
  }

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
    //const numberDay = Number(day) + 1;
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

  setNoTouchedDate(time: Moment): string {
    return `${time.year}-${time.month}-${time.day}`;
  }

  printPdf() {
    this.loadingReport = true;
    fetch(
      environment.apiUrl + "/Reportes/GenerarInforme/" + Number(this.formatoId)
    ).then((res) => {
      const name = res.headers.get("Nombreblob");
      res
        .blob()
        .then((res) => {
          let url = window.URL.createObjectURL(res);
          let a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          this.loadingReport = false;
          a.click();
          a.remove();
        })
        .catch((err) => {
          this.loadingReport = false;
        });
    });
  }
}
