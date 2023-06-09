import { Component, Input, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
//SERVICESS
import { ActivitiesService } from "../../activities.service";

//MODELSS
import { ActivityFake } from "app/projects/kmmp/fake-db/activities/activity-fake-db";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { Subject } from "rxjs";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() activityData: ActivityFake;
  nestado: string;
  activityInfo: any = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private activitiesService: ActivitiesService,
    private router: Router,
    private _editarFormatoService: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getActivityData(this.activityData.id);
    this.nestado = this.activityData.nestado;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getActivityData(id: number): void {
    this.activitiesService.getActivity(id).subscribe((resp: any) => {
      this.activityInfo = resp.body;
      if(this.activityInfo?.nos !== "null") {
        let tmp = this.activityInfo.nos.replace(/,/gi, ", ");
        this.activityInfo.nos = tmp;
      }
      if(this.activityInfo?.npe !== "null") {
        let tmp = this.activityInfo.npe.replace(/,/gi, ", ");
        this.activityInfo.npe = tmp;
      }
      this.getTimeDiff();
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
    const sumAdvance = this.activityInfo.formatos
      .filter((format) => format.activo)
      .map((x) => x.avance)
      .reduce((total, currentValue) => total + currentValue);

    const formatsLength = this.activityInfo.formatos.filter(
      (format) => format.activo
    ).length;

    return Math.round(sumAdvance / formatsLength);
  }

  getTimeDiff(): number {
    return Math.round(
      Math.abs(
        (new Date(this.activityInfo?.fechaHoraFinReal).getTime() -
          new Date(this.activityInfo?.fechaHoraIniReal).getTime()) /
          3600000
      )
    );
  }

  getTimeEstimatedDiff(): number {
    return Math.round(
      Math.abs(
        (new Date(this.activityInfo?.fechaEstimadaIni).getTime() -
          new Date(this.activityInfo?.fechaEstimadaFin).getTime()) /
          3600000
      )
    );
  }
}
