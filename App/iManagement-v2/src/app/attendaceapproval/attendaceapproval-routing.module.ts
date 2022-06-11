import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendaceapprovalPage } from './attendaceapproval.page';

const routes: Routes = [
  {
    path: '',
    component: AttendaceapprovalPage
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendaceapprovalPageRoutingModule {}
