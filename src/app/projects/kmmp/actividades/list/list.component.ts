import { Component, OnChanges, OnInit, SimpleChange } from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Pagination } from "app/core/types/list.types";
import { Observable, Subject } from "rxjs";
import {
  Activity,
  Asignaciones,
} from "../../fake-db/activities/activity-fake-db";
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
  activities: Activity[] = Asignaciones;
  assignToBay: boolean;
  isEdit: boolean;
  selectedActivity: any;

  start = new Date().toLocaleDateString("en-US");
  end = new Date().toLocaleDateString("en-US");

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  changePage(): void {}

  openAssignment(): void {
    this.matDialog.open(AssignBayComponent, {
      width: "370px",
      data: { type: "bahía" },
    });
  }

  selectActivity(event: MatCheckbox, index?: number): void {
    if (index || index === 0) {
      this.activities[index].checked = event.checked;
    } else {
      this.activities.map(
        (activity: Activity) => (activity.checked = event.checked)
      );
    }

    if (
      this.activities.find((activity: Activity) => activity.checked === true)
    ) {
      this.assignToBay = true;
    } else this.assignToBay = false;
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
}
