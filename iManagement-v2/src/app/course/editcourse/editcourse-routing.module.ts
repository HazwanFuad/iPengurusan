import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditcoursePage } from './editcourse.page';

const routes: Routes = [
  {
    path: '',
    component: EditcoursePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditcoursePageRoutingModule {}
