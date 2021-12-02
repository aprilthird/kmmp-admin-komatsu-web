import { Component, OnChanges, OnInit, SimpleChange } from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import { ActivityFake } from "../../fake-db/activities/activity-fake-db";
import { EditarFormatoService } from "../../formatos/editar-formato/editar-formato.service";
import { ActivitiesService } from "../activities.service";
import { AssignBayComponent } from "../dialogs/assign-bay/assign-bay.component";

@Component({
  selector: "list-activities",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  asignaciones$: Observable<any[]>;
  pagination$: Observable<Pagination>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading = false;
  //activities: Activity[] = Asignaciones;
  //activities: ActivityFake[] = ActivitiesData;
  activities: any[];
  assignToBay: boolean;
  isEdit: boolean;
  selectedActivity: any;

  start = new Date().toLocaleDateString("en-US");
  end = new Date().toLocaleDateString("en-US");
  checkAllBays: boolean;

  constructor(
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private editarFormatoService: EditarFormatoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.getAsignations();
    this.getActivities();
  }

  changePage(): void {}

  getActivities(): void {
    this.activitiesService.getActivities().subscribe((_activities: any) => {
      console.log(_activities);
      this.activities = _activities.body.data;
    });
  }

  getAsignations(): void {
    this.activitiesService.activities$.subscribe(
      (_activities: ActivityFake[]) => {
        this.activities = _activities;
      }
    );
  }

  openAssignment(): void {
    this.matDialog
      .open(AssignBayComponent, {
        width: "370px",
        data: { type: "bahía", activities: this.activities },
      })
      .afterClosed()
      .subscribe(() => {
        this.checkAllBays = false;
        return this.activities.map(
          (activity: ActivityFake) => (activity.checked = false)
        );
      });
  }

  selectActivity(event: MatCheckbox, index?: number): void {
    /**Check item */
    if (index || index === 0) {
      this.activities[index].checked = event.checked;
    } else {
      this.activities.map(
        (activity: ActivityFake) => (activity.checked = event.checked)
      );
    }
    /**Enable asign to bay button */
    if (
      this.activities.find(
        (activity: ActivityFake) => activity.checked === true
      )
    ) {
      this.assignToBay = true;
    } else {
      this.assignToBay = false;
    }

    console.log("this.activities ", this.activities);
  }

  daterange(event): void {
    if (event.startDate) {
      this.start = new Date(event.startDate._d).toLocaleDateString("en-US");
    }
    if (event.endDate) {
      this.end = new Date(event.endDate._d).toLocaleDateString("en-US");
    }
  }

  toggleDetails(actividad): void {
    if (this.selectedActivity && this.selectedActivity.id === actividad.id) {
      this.selectedActivity = null;
      return;
    }
    this.selectedActivity = actividad;
  }

  getFormats(activity): void {
    let format: number;
    let seccion: number;
    this.activitiesService.getActivity(activity).subscribe((formats: any) => {
      format = formats.body.formatos[0].idFormato;

      this.editarFormatoService
        .getObtenerFormatoCompleto(format)
        .subscribe((secciones: any) => {
          if (secciones.body.secciones.length > 0) {
            seccion = secciones.body.secciones[0].id;
            this.router.navigate([
              `/admin/actividades/validation/${activity}/${format}/${seccion}`,
            ]);
          }
        });
    });
  }
}
