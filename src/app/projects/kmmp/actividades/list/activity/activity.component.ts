import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AssignBayComponent } from "../../dialogs/assign-bay/assign-bay.component";

//SERVICES
import { ActivitiesService } from "../../activities.service";

//MODELS
import {
  Activity,
  ActivityFake,
} from "app/projects/kmmp/fake-db/activities/activity-fake-db";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit, OnChanges {
  formatData = formats;
  preloadedFormatsData = [];

  @Input() isEdit: boolean = false;
  @Input() activityData: ActivityFake;
  constructor(
    private dialog: MatDialog,
    private activitiesService: ActivitiesService
  ) {}

  ngOnInit(): void {
    this.preloadedFormats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("isEdit" in changes) {
      this.isEdit = changes["isEdit"].currentValue;
    }

    if ("activityData" in changes) {
      this.activityData = changes["activityData"].currentValue;
      console.log(this.activityData.formatos);
    }
  }

  assignFormat(): void {
    this.dialog.open(AssignBayComponent, {
      width: "370px",
      data: { type: "formato" },
    });
  }

  private preloadedFormats(): void {
    this.activitiesService.preloadedFormats.subscribe((formats: any) => {
      this.preloadedFormatsData = formats;
    });
  }

  removeFormat(index: number) {
    this.activityData.formatos.splice(index, 1);
  }
}

const formats = [
  { title: "Formato FM01", complete: true, porcentage: "75%" },
  { title: "Formato FM02", complete: true, porcentage: "75%" },
  { title: "Formato FM03", complete: true, porcentage: "75%" },
  { title: "Formato FM04", complete: false, porcentage: "75%" },
];
