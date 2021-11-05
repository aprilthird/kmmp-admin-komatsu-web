import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

//FAKE CONFIG
import {
  FormatosFake,
  FormatosData,
  ActivitiesData,
  ActivityFake,
} from "../fake-db/activities/activity-fake-db";

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  preloadedFormats: BehaviorSubject<any> = new BehaviorSubject(null);
  _activities: BehaviorSubject<any> = new BehaviorSubject(ActivitiesData);

  constructor() {}

  get preloadedFormats$(): Observable<any> {
    return this.preloadedFormats.asObservable();
  }

  set preloadedFormats$(data) {
    this.preloadedFormats.next(data);
  }

  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }

  set activities$(data) {
    this._activities.next(data);
  }

  addNewActivity(newData) {
    let data: any = this._activities.asObservable();
    this._activities.next([newData, ...data.source.value]);

    console.log(this._activities);
  }
}
