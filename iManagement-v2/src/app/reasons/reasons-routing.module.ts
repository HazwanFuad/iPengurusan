import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReasonsPage } from './reasons.page';

const routes: Routes = [
  {
    path: '',
    component: ReasonsPage
  },
  {
    path: 'listofreason',
    loadChildren: () => import('./listofreason/listofreason.module').then( m => m.ListofreasonPageModule)
  },
  {
    path: 'approval',
    loadChildren: () => import('./approval/approval.module').then( m => m.ApprovalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReasonsPageRoutingModule {}
