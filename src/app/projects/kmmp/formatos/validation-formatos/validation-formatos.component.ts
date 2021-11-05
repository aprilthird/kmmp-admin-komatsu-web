import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { DialogAddCommentComponent } from "../components/dialog-add-comment/dialog-add-comment.component";
import { DialogValidateFormatComponent } from "../components/dialog-validate-format/dialog-validate-format.component";

//SERVICES
import { ActivitiesService } from "../../actividades/activities.service";

//FAKE CONFIG
import {
  ActivityFake,
  FormatosFake,
} from "../../fake-db/activities/activity-fake-db";

@Component({
  selector: "app-validation-formatos",
  templateUrl: "./validation-formatos.component.html",
  styleUrls: ["./validation-formatos.component.scss"],
})
export class ValidationFormatosComponent implements OnInit {
  currentSeccion: string;
  drawerMode: "side" | "over";
  drawerOpened: boolean;
  menuData: any[];
  commented: boolean;

  constructor(
    private matDialog: MatDialog,
    private activityServices: ActivitiesService
  ) {
    this.menuData = [
      {
        id: "formatos",
        title: "Formatos",
        type: "group",
        children: [],
      },
    ];

    this.menuData[0].children.push({
      id: "formatos.formato1",
      title: "FM01",
      type: "collapsable",
      link: "/admin/actividades/validation/1/FM01",
      children: [
        {
          id: "formatos.formato1.section1",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/1/FM01/section1",
        },
        {
          id: "formatos.formato1.section2",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/1/FM01/section2",
        },
        {
          id: "formatos.formato1.section3",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/1/FM01/section3",
        },
      ],
    });

    this.menuData[0].children.push({
      id: "formatos.formato2",
      title: "FM02",
      type: "collapsable",
      link: "/admin/actividades/validation/1/FM02",
    });

    this.menuData[0].children.push({
      id: "formatos.formato3",
      title: "FM03",
      type: "collapsable",
      link: "/admin/actividades/validation/1/FM03",
    });
  }

  ngOnInit(): void {
    this.drawerMode = "side";
    this.drawerOpened = true;
    this.getActivities();
  }

  private getActivities(): void {
    this.activityServices.activities$.subscribe(
      (activities: ActivityFake[]) => {
        console.log(activities);
      }
    );
  }

  validate(): void {
    this.matDialog.open(DialogValidateFormatComponent, { width: "500px" });
  }

  addComment(): void {
    this.matDialog.open(DialogAddCommentComponent, { width: "500px" });
  }

  deleteComment(): void {}
}
