import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendaceapprovalPageRoutingModule } from './attendaceapproval-routing.module';

import { AttendaceapprovalPage } from './attendaceapproval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendaceapprovalPageRoutingModule
  ],
  declarations: [AttendaceapprovalPage]
})
export class AttendaceapprovalPageModule {}
