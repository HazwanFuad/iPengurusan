import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursePage } from './course.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePage
  },
  {
    path: 'apply',
    loadChildren: () => import('./apply/apply.module').then( m => m.ApplyPageModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'coursedetails/:id',
    loadChildren: () => import('./coursedetails/coursedetails.module').then( m => m.CoursedetailsPageModule)
  },
  {
    path: 'editcourse/:id',
    loadChildren: () => import('./editcourse/editcourse.module').then( m => m.EditcoursePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursePageRoutingModule {}
