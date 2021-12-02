import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AssignBayComponent } from "../../dialogs/assign-bay/assign-bay.component";
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
    private dialog: MatDialog,
    private activitiesService: ActivitiesService,
    private router: Router,
    private _editarFormatoService: EditarFormatoService
  ) {}

  ngOnInit(): void {
    console.log("this.activityData", this.activityData);
    this.getActivityData(this.activityData.id);
  }

  /*ngOnChanges(changes: SimpleChanges): void {
    if ("isEdit" in changes) {
      this.isEdit = changes["isEdit"].currentValue;
    }

    if ("activityData" in changes) {
      this.activityData = changes["activityData"].currentValue;
      console.log(this.activityData.formatos);
    }
  }*/

  getActivityData(id: number): void {
    this.activitiesService.getActivity(id).subscribe((resp: any) => {
      this.activityInfo = resp.body;
    });
  }
  assignFormat(): void {
    this.dialog.open(AssignBayComponent, {
      width: "370px",
      data: { type: "formato" },
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
