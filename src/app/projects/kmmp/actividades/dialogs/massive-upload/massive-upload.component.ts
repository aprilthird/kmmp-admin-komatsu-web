import { Component, OnInit } from "@angular/core";
import { FuseAlertType } from "@fuse/components/alert";
import { MassiveLoad } from "app/shared/config/massiveLoad";
import { environment } from "environments/environment";
import moment from "moment";

//SERVICES
import { ActivitiesService } from "../../activities.service";

@Component({
  selector: "app-massive-upload",
  templateUrl: "./massive-upload.component.html",
  styleUrls: ["./massive-upload.component.scss"],
})
export class MassiveUploadComponent implements OnInit {
  //file = new FormControl(Validators.required);
  file: any = "";
  fileFormat = `https://appinformes.blob.core.windows.net/kmmp/carga%20masiva?${moment()}&${
    environment.azureSas
  }`;
  isLoading: boolean;
  alert: { type: FuseAlertType; message: string };
  errorMessages: { type: FuseAlertType; message: string };
  fileName: string;
  badRecords: any[] = [];
  successRecords: any[] = [];

  constructor(private _activitiesService: ActivitiesService) {}

  ngOnInit(): void {}

  uploadFile(): void {
    this.isLoading = true;
    this._activitiesService.massiveActivitiesUpload(this.file).subscribe(
      (resp) => {
        this.isLoading = false;

        this.badRecords = resp.body.filter((record) => record?.error);
        this.successRecords = resp.body.filter((record) => !record?.error);
        if (resp.body.length === 0) {
          this.alert = {
            type: "warning",
            message: `Ningún registro ha sido cargado`,
          };
        } else if (this.successRecords.length === resp.body.length) {
          this.alert = {
            type: "success",
            message: `${resp.message ? resp.message : MassiveLoad.ALL_SUCCESS}`,
          };
        } else {
          this.alert = {
            type: "warning",
            message: `${this.successRecords.length} ${MassiveLoad.SOME_SUCCESS}, ${this.badRecords.length} ${MassiveLoad.SOME_WRONG}`,
          };
        }
      },
      (err) => {
        this.isLoading = false;
        this.alert = {
          type: "error",
          message: `${err?.message || "Error en la carga"}`,
        };
      }
    );
  }

  onChangeFile(event: any): void {
    if (event.target.files?.length > 0) {
      this.file = event.target.files[0];
      this.fileName = this.file.name;
    }
  }
}
