import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditcoursePageRoutingModule } from './editcourse-routing.module';

import { EditcoursePage } from './editcourse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditcoursePageRoutingModule
  ],
  declarations: [EditcoursePage]
})
export class EditcoursePageModule {}
