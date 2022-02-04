import { Component, OnInit } from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import { ActivityFake } from "../../fake-db/activities/activity-fake-db";
import { EditarFormatoService } from "../../formatos/editar-formato/editar-formato.service";
import { ActivitiesService } from "../activities.service";
import { AssignBayComponent } from "../dialogs/assign-bay/assign-bay.component";
import { PostponeComponent } from "../dialogs/postpone/postpone.component";

@Component({
  selector: "list-activities",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  asignaciones$: Observable<any[]>;
  pagination$: Observable<Pagination>;
  actividades$: Observable<any[]>;
  isLoading: boolean;

  activities: any[];
  assignToBay: boolean;
  isEdit: boolean;
  selectedActivity: any;

  start = new Date().toLocaleDateString("es-ES");
  end = new Date().toLocaleDateString("es-ES");
  checkAllBays: boolean;

  constructor(
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private editarFormatoService: EditarFormatoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.getActivities();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changePage(): void {}

  getActivities(): void {
    this.isLoading = true;

    this.activitiesService._activities.subscribe((activities: any) => {
      this.activities = activities;
    });
  }

  loadData() {
    this.isLoading = true;
    this.activitiesService.getActivities().subscribe(() => {
      this.isLoading = false;
    });
  }

  openAssignment(): void {
    this.assignToBay = false;
    this.matDialog
      .open(AssignBayComponent, {
        width: "370px",
        data: { type: "bahía", activities: this.activities },
      })
      .afterClosed()
      .subscribe(() => {
        this.getActivities();
        this.activities.map(
          (activity: ActivityFake) => (activity.checked = false)
        );
        this.loadData();
      });
  }

  checkAllFn(): boolean {
    let value = false;
    const activWithBahia = this.activities.filter((x) => x.bahia);
    if (activWithBahia.every((x) => x.checked)) {
      value = true;
    }
    return value;
  }

  selectActivity(event: MatCheckbox, index?: number): void {
    /**Check item */
    if (index || index === 0) {
      this.activities[index].checked = event.checked;
    } else {
      this.activities
        .filter(
          (activity: ActivityFake) => !activity.bahia || activity.bahia === ""
        )
        .map((activity: ActivityFake) => (activity.checked = event.checked));
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

    this.checkAllFn();
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
      format = formats.body.formatos[0].idActividadFormato;

      this.editarFormatoService
        .getAbrirAsignacion(format)
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

  postponeActivity(activity: any): void {
    this.matDialog
      .open(PostponeComponent, {
        data: activity,
        width: "450px",
      })
      .afterClosed()
      .subscribe(() => {
        this.loadData();
      });
  }

  checkSomeUncheck(): boolean {
    return this.activities.some(
      (activity) => !activity.bahia || activity.bahia === ""
    );
  }
}
