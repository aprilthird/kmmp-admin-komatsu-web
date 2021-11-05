import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

//FAKE CONFIG
import {
  FormatosFake,
  FormatosData,
} from "../fake-db/activities/activity-fake-db";

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  preloadedFormats: BehaviorSubject<any> = new BehaviorSubject(null);
  _activities: BehaviorSubject<FormatosFake[]> = new BehaviorSubject(
    FormatosData
  );

  constructor() {}

  get preloadedFormats$(): Observable<any> {
    return this.preloadedFormats.asObservable();
  }

  set preloadedFormats$(data) {
    this.preloadedFormats.next(data);
  }

  get acttivities$(): Observable<FormatosFake[]> {
    return this._activities.asObservable();
  }

  set activities$(data) {
    this._activities.next(data);
  }
}
