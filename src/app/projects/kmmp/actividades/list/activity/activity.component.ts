import { Component, Input, OnInit } from "@angular/core";

import { Router } from "@angular/router";

//SERVICES
import { ActivitiesService } from "../../activities.service";

//MODELS
import { ActivityFake } from "app/projects/kmmp/fake-db/activities/activity-fake-db";
import { EditarFormatoService } from "app/projects/kmmp/formatos/editar-formato/editar-formato.service";

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
    private _editarFormatoService: EditarFormatoService
  ) {}

  ngOnInit(): void {
    this.getActivityData(this.activityData.id);
  }

  private getActivityData(id: number): void {
    this.activitiesService.getActivity(id).subscribe((resp: any) => {
      this.activityInfo = resp.body;
    });
  }
  async removeFormat(index: number) {
    const formatSelected = await this.activityInfo.formatos[index];
    this.activitiesService
      .deleteFormatById(formatSelected.idActividadFormato)
      .subscribe((resp: any) => {
        this.activityInfo.formatos.splice(index, 1);
      });
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
        console.log("secciones ", secciones);
        this.router.navigate([
          `/admin/actividades/validation/${this.activityData.id}/${e.idActividadFormato}/${secciones.body.secciones[0].id}`,
        ]);
      });
  }
}
