import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPermissionGuard } from 'app/core/permission/guards/menu-permission.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { KmmpComponent } from './kmmp.component';

const routes: Routes = [{
  path: '',
  component: KmmpComponent,
  children: [
    {
      path: 'ajustes',
      loadChildren: () => import('./ajustes/ajustes.module').then(m => m.AjustesModule)
    },
    {
      path: 'formatos',
      loadChildren: () => import('./formatos/formatos.module').then(m => m.FormatosModule)
    },
    {
      path: '',
      component: DashboardComponent,
      canActivate: [MenuPermissionGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KmmpRoutingModule { }
