import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ListadoService } from "../../formatos/listado/listado.services";
import { ActivitiesService } from "../activities.service";
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
    private _listadoService: ListadoService,
    private _activitiesService: ActivitiesService
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
    const startDate = new Date(this.dateRange.controls["startDate"].value);
    const endDate = new Date(this.dateRange.controls["endDate"].value);
    if (Number(setFormatDate(endDate).split("-")[0]) > 2020) {
      this.loadInbox(setFormatDate(startDate), setFormatDate(endDate));
    }
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

  loadInbox(fechaInicio: string, fechaFin: string) {
    return this._activitiesService
      .getActivities({ fechaInicio, fechaFin })
      .subscribe(() => {});
  }
}

function setFormatDate(date: Date): string {
  const currentMonth = Number(date.getMonth()) + 1;
  return (
    date.getFullYear() +
    "-" +
    addZero(currentMonth) +
    "-" +
    addZero(date.getUTCDate())
  );
}

function addZero(value): string {
  if (value < 10) return "0" + value;
  return value;
}
