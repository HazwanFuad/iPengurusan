import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserdashboardPage } from './userdashboard.page';

const routes: Routes = [
  {
    path: '',
    component: UserdashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserdashboardPageRoutingModule {}
