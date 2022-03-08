import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FuseAlertType } from "@fuse/components/alert";
import { environment } from "environments/environment";

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
  fileFormat = `https://appinformes.blob.core.windows.net/kmmp/carga%20masiva?${environment.azureSas}`;
  isLoading: boolean;
  alert: { type: FuseAlertType; message: string };
  fileName: string;

  constructor(private _activitiesService: ActivitiesService) {}

  ngOnInit(): void {}

  uploadFile(): void {
    this.isLoading = true;
    this._activitiesService.massiveActivitiesUpload(this.file).subscribe(
      (resp) => {
        this.isLoading = false;

        const badRecords = resp.body.filter((record) => record.error);
        const successRecords = resp.body.filter((record) => !record.error);

        if (successRecords.length === resp.body.length) {
          this.alert = {
            type: "success",
            message: `${
              resp.message
                ? resp.message
                : "Todos los registros han sido cargados!"
            }`,
          };
        } else {
          this.alert = {
            type: "warning",
            message: `${successRecords.length} registros exitosos, ${badRecords.length} registros no han sido procesados!`,
          };
        }
      },
      (err) => {
        this.isLoading = false;
        this.alert = {
          type: "error",
          message: `${err.message}`,
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
