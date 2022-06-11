import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListofreasonPage } from './listofreason.page';

const routes: Routes = [
  {
    path: '',
    component: ListofreasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListofreasonPageRoutingModule {}
