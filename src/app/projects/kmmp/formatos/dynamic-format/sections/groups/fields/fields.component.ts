import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-fields",
  templateUrl: "./fields.component.html",
  styleUrls: ["./fields.component.scss"],
})
export class FieldsComponent implements OnInit {
  @Input() groupData: any;

  constructor() {}

  ngOnInit(): void {}
}

interface Params {}
