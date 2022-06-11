import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendacePageRoutingModule } from './attendace-routing.module';

import { AttendacePage } from './attendace.page';
import { CalendarModule } from 'ion2-calendar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendacePageRoutingModule,
    CalendarModule
  ],
  declarations: [AttendacePage]
})
export class AttendacePageModule {}
