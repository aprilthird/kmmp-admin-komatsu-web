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
  fileFormat =
    "https://appinformes.blob.core.windows.net/kmmp/carga%20masiva?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-03T23:39:46Z&st=2022-01-03T15:39:46Z&spr=https&sig=BU4Y9BHhsNT4EbY%2FM2eJZ7X9EYdNE4NUC9nbcSwFuc8%3D";

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
