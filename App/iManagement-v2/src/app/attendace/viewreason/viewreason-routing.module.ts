import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewreasonPage } from './viewreason.page';

const routes: Routes = [
  {
    path: '',
    component: ViewreasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewreasonPageRoutingModule {}
