import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ListadoService } from "../../formatos/listado/listado.services";
import { FilterDialogComponent } from "./filter-dialog/filter-dialog.component";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  dateRange = new FormGroup({
    startDate: new FormControl({ value: null }),
    endDate: new FormControl({ value: null }),
  });

  @Output() range: EventEmitter<any> = new EventEmitter();
  filtered: boolean;
  constructor(
    private matDialog: MatDialog,
    private _listadoService: ListadoService
  ) {}

  ngOnInit(): void {
    this.isFiltered();
  }

  openFilter(): void {
    this.matDialog.open(FilterDialogComponent, {
      width: "370px",
      data: { source: "activities" },
    });
  }
  changeDate(): void {
    this.range.emit(this.dateRange.value);
  }

  isFiltered() {
    this._listadoService._filter
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filter: any) => {
        let isFilters = [];
        if (filter) {
          Object.values(filter).forEach((x) => {
            if (x) isFilters.push(x);
          });
          if (isFilters.length > 0) this.filtered = true;
          else this.filtered = false;
        }
      });
  }
}
