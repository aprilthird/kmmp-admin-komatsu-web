import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { DialogAddCommentComponent } from "../components/dialog-add-comment/dialog-add-comment.component";
import { DialogValidateFormatComponent } from "../components/dialog-validate-format/dialog-validate-format.component";
import { ActivatedRoute } from "@angular/router";

//SERVICES
import { ActivitiesService } from "../../actividades/activities.service";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";

//FAKE CONFIG
import { ActivityFake } from "../../fake-db/activities/activity-fake-db";

//CONFIG
import { TipoParametro } from "app/core/types/formatos.types";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AzureService } from "app/core/azure/azure.service";

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
  commented: boolean;
  currentIdActivity: any;
  currentActivity: any;
  sectionSelected: any;
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
  currentSection: any;
  sectionName: string = "";
  formatID: string = "";
  countGroups = 0;

  constructor(
    private matDialog: MatDialog,
    private activityServices: ActivitiesService,
    private routerActive: ActivatedRoute,
    private _editarFormatoService: EditarFormatoService,
    private fb: FormBuilder,
    private _azureService: AzureService
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
        .getObtenerFormatoCompleto(this.formatoId)
        .subscribe((x: any) => {
          this.data.secciones = x.body.secciones.filter(
            (seccion: any) => seccion.id === Number(this.sectionId)
          );
          this.generateForm();
          this.sectionName = this.data.secciones[0].nombre;
        });
    });
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
          .getObtenerFormatoCompleto(format.id)
          .subscribe((x: any) => {
            const format = x.body;

            this.menuData[0].children.push({
              id: x.id,
              title: format.nombre,
              type: "collapsable",
              link: `/admin/actividades/validation/${this.currentIdActivity}/${format.id}`,
              children: [],
            });

            format.secciones.forEach((section, index) => {
              this.menuData[0].children[index].children.push({
                id: section.id,
                title: section.nombre,
                type: "basic",
                link: `/admin/actividades/validation/${this.currentIdActivity}/${format.id}/${section.id}`,
              });
            });
            this.displayNav = true;
          });
      });

      /*this.currentActivity.formatos.forEach((formato, index) => {
        //setTimeout(() => {
        this.menuData[0].children.push({
          id: undefined,
          title: formato.nombre,
          type: "collapsable",
          link: `/admin/actividades/validation/${this.currentIdActivity}/${formato.id}`,
          children: [],
        });

        formato.sections.forEach((section) => {
          this.menuData[0].children[index].children.push({
            id: undefined,
            title: section.name,
            type: "basic",
            link: `/admin/actividades/validation/${this.currentIdActivity}/${formato.id}/${section.id}`,
          });
        });

        console.log(" this.menuData ", this.menuData);
      });
      //});*/
    });
  }
  /**FIN MENU DE NAVEGACION DINAMICO */

  /**obtener data fake */
  private getActivities(): void {
    this.activityServices.activities$.subscribe(
      (activities: ActivityFake[]) => {
        this.currentActivity = activities.find(
          (activity) => activity.id === Number(this.currentIdActivity)
        );

        this.setCollapsableNav();
      }
    );
  }
  /**fin obtener data fake */

  /**************************OBTENER/GESTIONS ASIGNACION********************************* */
  /*getAsignaciones(): void {
    this._editarFormatoService.getAbrirAsignacion(6).subscribe((response) => {
      this.data = response.body;
      this.generateForm();
      this.loading = false;
    });
  }*/

  generateForm() {
    this.countGroups = 0;
    this.data.secciones.forEach((seccion, i) => {
      seccion.grupos.forEach((grupo, j) => {
        this.countGroups = this.countGroups + 1;

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
    this.matDialog.open(DialogValidateFormatComponent, { width: "500px" });
  }

  addComment(): void {
    this.matDialog.open(DialogAddCommentComponent, { width: "500px" });
  }

  deleteComment(): void {}
}
