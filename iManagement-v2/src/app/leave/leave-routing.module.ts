import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavePage } from './leave.page';

const routes: Routes = [
  {
    path: '',
    component: LeavePage
  },
  {
    path: 'submit',
    loadChildren: () => import('./submit/submit.module').then( m => m.SubmitPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'leavedetails/:id',
    loadChildren: () => import('./leavedetails/leavedetails.module').then( m => m.LeavedetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavePageRoutingModule {}
