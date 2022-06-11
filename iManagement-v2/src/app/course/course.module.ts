import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursePageRoutingModule } from './course-routing.module';

import { CoursePage } from './course.page';
import { OrderByPipe } from './oderby.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoursePageRoutingModule
  ],
  declarations: [CoursePage, OrderByPipe]
})
export class CoursePageModule {}
