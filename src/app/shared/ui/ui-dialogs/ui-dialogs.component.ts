import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-ui-dialogs",
  templateUrl: "./ui-dialogs.component.html",
  styleUrls: ["./ui-dialogs.component.scss"],
})
export class UiDialogsComponent implements OnInit {
  message: string;
  title: string;

  constructor(
    public matDialog: MatDialogRef<UiDialogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router
  ) {
    this.message = this.data.message;
    this.title = this.data.title;
    if (this.data?.action === "redirect") {
      this.matDialog
        .afterClosed()
        .subscribe(() => this.router.navigate([this.data?.url]));
    }
  }

  ngOnInit(): void {}
}
