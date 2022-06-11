import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursedetailsPage } from './coursedetails.page';

const routes: Routes = [
  {
    path: '',
    component: CoursedetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursedetailsPageRoutingModule {}
