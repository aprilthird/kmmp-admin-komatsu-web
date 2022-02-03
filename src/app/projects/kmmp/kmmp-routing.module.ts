import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuPermissionGuard } from "app/core/permission/guards/menu-permission.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardResolver } from "./dashboard/dashboard.resolver";
import { HomeComponent } from "./home/home.component";
import { KmmpComponent } from "./kmmp.component";

const routes: Routes = [
  {
    path: "",
    component: KmmpComponent,
    children: [
      {
        path: "ajustes",
        loadChildren: () =>
          import("./ajustes/ajustes.module").then((m) => m.AjustesModule),
      },
      {
        path: "formatos",
        loadChildren: () =>
          import("./formatos/formatos.module").then((m) => m.FormatosModule),
      },
      {
        path: "actividades",
        loadChildren: () =>
          import("./actividades/actividades.module").then(
            (m) => m.ActividadesModule
          ),
      },
      {
        path: "maestros",
        loadChildren: () =>
          import("./maestros/maestros.module").then((m) => m.MaestrosModule),
      },
      {
        path: "",
        component: DashboardComponent,
        resolve: {
          initialData: DashboardResolver,
        },
        canActivate: [MenuPermissionGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KmmpRoutingModule {}
