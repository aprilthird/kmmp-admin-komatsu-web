import { Component, OnInit } from "@angular/core";

//SERVICES
import { ActivitiesService } from "../../activities.service";

@Component({
  selector: "app-massive-upload",
  templateUrl: "./massive-upload.component.html",
  styleUrls: ["./massive-upload.component.scss"],
})
export class MassiveUploadComponent implements OnInit {
  //file = new FormControl(Validators.required);
  file = "";

  constructor(private _activitiesService: ActivitiesService) {}

  ngOnInit(): void {}

  uploadFile(): void {
    console.log(this.file);
    this._activitiesService
      .massiveActivitiesUpload(this.file)
      .subscribe((resp) => {
        console.log("upload file resp ", resp);
      });
  }

  onChangeFile(event: any): void {
    if (event.target.files?.length > 0) {
      this.file = event.target.files[0];
    }
  }
}
