import { Component, Input, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
//SERVICES
import { ActivitiesService } from "../../activities.service";

//MODELS
import { ActivityFake } from "app/projects/kmmp/fake-db/activities/activity-fake-db";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() activityData: ActivityFake;
  activityInfo: any = [];
  constructor(
    private activitiesService: ActivitiesService,
    private router: Router,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getActivityData(this.activityData.id);
  }

  private getActivityData(id: number): void {
    this.activitiesService.getActivity(id).subscribe((resp: any) => {
      this.activityInfo = resp.body;
      this.totalAdvance();
    });
  }
  async removeFormat(index: number) {
    if (this.activityInfo.formatos.length > 1) {
      const dialogRef = this._fuseConfirmationService.open({
        title: "Eliminar formato",
        message: "¿Estás seguro que desea eliminar el formato?",

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

      dialogRef.beforeClosed().subscribe(async (result) => {
        const formatSelected = await this.activityInfo.formatos[index];

        if (result === "confirmed") {
          this.activitiesService
            .deleteFormatById(formatSelected.idActividadFormato)
            .subscribe(() => {
              this.activityInfo.formatos.splice(index, 1);
            });
        }
      });
    } else {
      this.matDialog.open(UiDialogsComponent, {
        width: "500px",
        data: {
          title: "Advertencia",
          message:
            "Debe tener al menos un formato por informe, no es posible eliminarlo!",
        },
      });
    }
  }

  enableDeleteFormats(): boolean {
    if (this.activityInfo.formatos.filter((x: any) => x.activo).length > 1) {
      return true;
    }
    return false;
  }

  redirect(e: any) {
    this._editarFormatoService
      .getAbrirAsignacion(e.idActividadFormato)
      .subscribe((secciones) => {
        if (secciones.body.secciones && secciones.body.secciones.length > 0) {
          this.router.navigate([
            `/admin/actividades/validation/${this.activityData.id}/${e.idActividadFormato}/${secciones.body.secciones[0].id}`,
          ]);
        } else {
          this.matDialog.open(UiDialogsComponent, {
            width: "500px",
            data: {
              title: "Mensaje",
              message: "No existen secciones en el formato seleccionado!",
            },
          });
        }
      });
  }

  totalAdvance(): number {
    return (
      this.activityInfo.formatos
        .filter((format) => format.activo)
        .reduce((x, y) => x.avance + y.avance) /
      this.activityInfo.formatos.filter((format) => format.activo).length
    );
  }
}
