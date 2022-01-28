import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivitiesService } from "../../activities.service";

interface ReasonI {
  id: number;
  nombre: string;
}

@Component({
  selector: "app-postpone",
  templateUrl: "./postpone.component.html",
  styleUrls: ["./postpone.component.scss"],
})
export class PostponeComponent implements OnInit {
  reasons$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchLoader: boolean;
  isLoading: boolean;
  reason: ReasonI;

  constructor(
    public matdialigRef: MatDialogRef<PostponeComponent>,
    private _activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getReasons();
  }

  private getReasons(): void {
    this.reasons$ = this._activitiesService
      .postponeReason()
      .pipe(takeUntil(this._unsubscribeAll));
  }

  postpone(): void {
    this.isLoading = true;
    const payload = {
      ...this.data,
      idMotivoPostergado: this.reason.id,
      motivoPostergado: this.reason.nombre,
      descripcion: this.reason.nombre,
    };
    this._activitiesService.postponeActivity(payload).subscribe(
      () => {
        this.isLoading = false;
        this.matdialigRef.close();
      },
      () => {
        this.isLoading = false;
        this.matdialigRef.close();
      }
    );
  }

  setReason(e: MatSelect): void {
    this.reason = e.value;
  }
}
