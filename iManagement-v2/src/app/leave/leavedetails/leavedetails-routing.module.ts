import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavedetailsPage } from './leavedetails.page';

const routes: Routes = [
  {
    path: '',
    component: LeavedetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavedetailsPageRoutingModule {}
