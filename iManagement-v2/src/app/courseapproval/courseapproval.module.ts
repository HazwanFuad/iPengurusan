import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseapprovalPageRoutingModule } from './courseapproval-routing.module';

import { CourseapprovalPage } from './courseapproval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseapprovalPageRoutingModule
  ],
  declarations: [CourseapprovalPage]
})
export class CourseapprovalPageModule {}
