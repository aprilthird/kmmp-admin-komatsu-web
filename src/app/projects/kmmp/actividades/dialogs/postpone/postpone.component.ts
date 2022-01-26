import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-postpone",
  templateUrl: "./postpone.component.html",
  styleUrls: ["./postpone.component.scss"],
})
export class PostponeComponent implements OnInit {
  constructor(public matdialigRef: MatDialogRef<PostponeComponent>) {}

  searchLoader: boolean;
  isLoading: boolean;
  items: any[] = [];

  ngOnInit(): void {}

  private getReasons(): void {}

  postpone(): void {}
}
