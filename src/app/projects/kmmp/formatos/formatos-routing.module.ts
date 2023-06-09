import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { initial } from "lodash";

import { AsignacionesComponent } from "./asignaciones/asignaciones.component";
import { AsignarFormatoComponent } from "./asignar-formato/asignar-formato.component";
import { EditarFormatoComponent } from "./editar-formato/editar-formato.component";
import { EditarFormatoResolver } from "./editar-formato/editar-formato.resolver";
import { GruposComponent } from "./editar-formato/grupos/grupos.component";
import { ListadoComponent } from "./listado/listado.component";
import { DynamicFormatoResolver } from "./dynamic-format/dynamic-format.resolver";

//APERTUR ASIGNACION
import { AperturaAsignacionComponent } from "./asignaciones/apertura-asignacion/apertura-asignacion.component";
import { DynamicFormatComponent } from "./dynamic-format/dynamic-format.component";

const routes: Routes = [
  {
    path: "editar/:id/:idSeccion",
    component: EditarFormatoComponent,
    resolve: {
      initialData: EditarFormatoResolver,
    },
  },
  {
    path: "editar/:id",
    component: EditarFormatoComponent,
    resolve: {
      initialData: EditarFormatoResolver,
    },
  },
  {
    path: "asignar/:id",
    component: AsignarFormatoComponent,
    resolve: {
      initialData: EditarFormatoResolver,
    },
  },
  {
    path: "asignaciones",
    component: AsignacionesComponent,
  },
  {
    path: "asignaciones/apertura/:id",
    component: AperturaAsignacionComponent,
  },
  {
    path: "formato-dinamico/:id",
    component: DynamicFormatComponent,
    resolve: {
      initialData: DynamicFormatoResolver,
    },
  },
  {
    path: "",
    component: ListadoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormatosRoutingModule {}
