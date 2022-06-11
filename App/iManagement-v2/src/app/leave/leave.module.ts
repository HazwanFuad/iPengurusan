import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeavePageRoutingModule } from './leave-routing.module';

import { LeavePage } from './leave.page';

import { CalendarModule } from 'ion2-calendar';
import { OrderByPipe } from './oderby.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeavePageRoutingModule,
    CalendarModule
  ],
  declarations: [LeavePage, OrderByPipe]
})
export class LeavePageModule {}
