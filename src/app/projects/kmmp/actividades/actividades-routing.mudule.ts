import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuPermissionGuard } from "app/core/permission/guards/menu-permission.guard";
import { ActividadesComponent } from "./actividades.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: ActividadesComponent,
    children: [
      {
        path: "list",
        component: ListComponent,
        //canActivate: [MenuPermissionGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActividadesRoutingModule {}
