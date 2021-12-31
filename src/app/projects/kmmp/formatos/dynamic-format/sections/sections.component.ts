import { Component, Input, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { FormatosService } from "../../formatos.service";

@Component({
  selector: "app-sections",
  templateUrl: "./sections.component.html",
  styleUrls: ["./sections.component.scss"],
})
export class SectionsComponent implements OnInit {
  @Input() sectionData: any;
  isLoading: boolean;
  sections$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _formatosService: FormatosService) {}

  ngOnInit(): void {}

  postGroup(): void {
    this._formatosService.addGroup(this.sectionData.id);
  }
}
