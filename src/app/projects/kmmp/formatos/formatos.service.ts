import { X } from "@angular/cdk/keycodes";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormatosService {
  _sections: BehaviorSubject<any> = new BehaviorSubject([]);
  sectionList = [];
  constructor(private _httpClient: HttpClient) {}

  get section$(): Observable<any> {
    return this._sections.asObservable();
  }
  set section$(section) {
    const long = this.sectionList.length + 1;
    const newSection = {
      id: long,
      nombre: "Sección " + long,
      grupos: [],
    };
    this.sectionList.push(newSection);
    this._sections.next(this.sectionList);
  }

  addGroup(idSection: number) {
    this.sectionList
      .filter((section) => section.id === idSection)
      .map((x) =>
        x.grupos.push({
          id: x.grupos.length,
          nombre: x.grupos.length,
        })
      );

    this._sections.next(this.sectionList);
  }

  validateSection(data): Observable<any> {
    const endpoint = environment.apiUrl + "/Mantenimiento/ValidarSeccion";
    return this._httpClient.post<any>(endpoint, data);
  }

  validateFormat(data): Observable<any> {
    const endpoint = environment.apiUrl + "/Mantenimiento/ValidarFormato";
    return this._httpClient.post<any>(endpoint, data);
  }
}
