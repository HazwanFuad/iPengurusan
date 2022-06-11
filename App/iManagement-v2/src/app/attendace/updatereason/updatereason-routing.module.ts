import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatereasonPage } from './updatereason.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatereasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatereasonPageRoutingModule {}
