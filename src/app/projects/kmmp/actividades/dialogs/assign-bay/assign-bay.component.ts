import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { ActivitiesService } from "../../activities.service";
import { ListComponent } from "../../list/list.component";
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
    this.activitiesService.getList(4).subscribe((resp: any) => {
      this.items = resp.body.data;
    });
  }

  setDataToAssign(event): void {
    this.dataToAssign = {
      id: 0,
      codigo: "string",
      nombre: "string",
      descripcion: "string",
      visible: true,
      activo: true,
      asignado: true,
      estado: 0,
      subEstado: 0,
      fechaReg: "2021-12-01T01:22:47.462Z",
      fechaMod: "2021-12-01T01:22:47.462Z",
      usuarioMod: "string",
      usuarioReg: "string",
      idUsuarioReg: 0,
      idUsuarioMod: 0,
      entidad: 0,
      total: 0,
      idBahia: event.value,
      idsActividades: this.getIdActivities(),
    };
  }

  assignToBay(): void {
    this.isLoading = true;
    this.activitiesService.asignMultipleActivities(this.dataToAssign).subscribe(
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
