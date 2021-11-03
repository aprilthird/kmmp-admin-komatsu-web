import { Component, OnInit } from "@angular/core";

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

  constructor() {
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
      link: "/admin/actividades/validation/FM01",
      children: [
        {
          id: "formatos.formato1.section1",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/FM01/section1",
        },
        {
          id: "formatos.formato1.section2",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/FM01/section2",
        },
        {
          id: "formatos.formato1.section3",
          title: "section1",
          type: "basic",
          link: "/admin/actividades/validation/FM01/section3",
        },
      ],
    });

    this.menuData[0].children.push({
      id: "formatos.formato2",
      title: "FM02",
      type: "collapsable",
      link: "/admin/actividades/validation/FM02",
    });

    this.menuData[0].children.push({
      id: "formatos.formato3",
      title: "FM03",
      type: "collapsable",
      link: "/admin/actividades/validation/FM03",
    });
  }

  ngOnInit(): void {
    this.drawerMode = "side";
    this.drawerOpened = true;
  }
}
