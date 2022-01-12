import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { EditarFormatoService } from "../editar-formato/editar-formato.service";

@Injectable({
  providedIn: "root",
})
export class DynamicFormatoResolver implements Resolve<boolean> {
  constructor(private _editarFormatoService: EditarFormatoService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return forkJoin([
      this._editarFormatoService.getSecciones({
        idFormulario: route.params.id,
        reload: true,
      }),
      this._editarFormatoService.getFormato(route.params.id),
      this._editarFormatoService.getTipoDatos(),
    ]);
  }
}
