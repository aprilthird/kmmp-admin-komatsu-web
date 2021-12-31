import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { FormatosService } from "../formatos.service";

@Component({
  selector: "app-dynamic-format",
  templateUrl: "./dynamic-format.component.html",
  styleUrls: ["./dynamic-format.component.scss"],
})
export class DynamicFormatComponent implements OnInit {
  isLoading: boolean;
  sections$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _formatosService: FormatosService) {}

  ngOnInit(): void {
    this.getSections();
  }

  private getSections(): void {
    this.sections$ = this._formatosService.section$.pipe(
      takeUntil(this._unsubscribeAll)
    );
  }

  postSection(section): void {
    this._formatosService.section$ = section;
  }
}
