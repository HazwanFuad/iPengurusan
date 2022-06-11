import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendacePage } from './attendace.page';

const routes: Routes = [
  {
    path: '',
    component: AttendacePage
  },
  {
    path: 'work',
    loadChildren: () => import('./work/work.module').then( m => m.WorkPageModule)
  },
  {
    path: 'updatereason/:id',
    loadChildren: () => import('./updatereason/updatereason.module').then( m => m.UpdatereasonPageModule)
  },
  {
    path: 'approve',
    loadChildren: () => import('./approve/approve.module').then( m => m.ApprovePageModule)
  },
  {
    path: 'viewreason',
    loadChildren: () => import('./viewreason/viewreason.module').then( m => m.ViewreasonPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendacePageRoutingModule {}
