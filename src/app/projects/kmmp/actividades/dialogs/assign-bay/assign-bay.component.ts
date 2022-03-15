import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivitiesService } from "../../activities.service";
import { dataToAssign } from "../config";
import { BayI } from "./../../models/bays-model";

@Component({
  selector: "app-assign-bay",
  templateUrl: "./assign-bay.component.html",
  styleUrls: ["./assign-bay.component.scss"],
})
export class AssignBayComponent implements OnInit {
  searchLoader: boolean;
  isLoading: boolean;
  items: BayI[] = [];
  preloadedFormatsData = [];
  dataToAssign: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matdialigRef: MatDialogRef<AssignBayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activitiesService: ActivitiesService,
    private _matDialog: MatDialog
  ) {
    this.getBays();
  }

  ngOnInit(): void {}

  private getBays(): void {
    this.activitiesService
      .getList(4)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resp: any) => {
        this.items = resp.body.data;
      });
  }

  setDataToAssign(event): void {
    this.dataToAssign = {
      ...dataToAssign,
      idBahia: event.value,
      idsActividades: this.getIdActivities(),
    };
  }

  assignToBay(): void {
    this.isLoading = true;
    this.activitiesService
      .asignMultipleActivities(this.dataToAssign)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (resp) => {
          if (resp.code === 502) {
            this.isLoading = false;
            this._matDialog.open(UiDialogsComponent, {
              width: "500px",
              data: {
                message: resp.message ? resp?.message : resp?.error,
                title: "Error",
                action: "/admin/actividades/list",
              },
            });
            this.matdialigRef.close();
          } else {
            this.isLoading = false;
            this.matdialigRef.close();
          }
        },
        (err) => {
          this.isLoading = false;
          this._matDialog.open(UiDialogsComponent, {
            width: "500px",
            data: {
              message: err.message ? err.message : err.code,
              title: "Error",
              action: "/admin/actividades/list",
            },
          });
          this.matdialigRef.close();
        }
      );
  }

  private getIdActivities(): number[] {
    return this.data.activities
      .filter((activity: any) => activity.checked)
      .map((x: any) => {
        return x.id;
      });
  }

  searchLoading(): void {
    this.searchLoader = true;
    setTimeout(() => {
      this.searchLoader = false;
    }, 1500);
  }
}
