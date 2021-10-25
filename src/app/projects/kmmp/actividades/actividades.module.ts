import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActividadesComponent } from "./actividades.component";
import { FilterComponent } from "./filter/filter.component";
import { ActividadesRoutingModule } from "./actividades-routing.mudule";
import { ListComponent } from "./list/list.component";
import { SharedModule } from "app/shared/shared.module";
import { MatIconModule } from "@angular/material/icon";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ActividadesComponent, FilterComponent, ListComponent],
  imports: [
    CommonModule,
    ActividadesRoutingModule,
    SharedModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class ActividadesModule {}
