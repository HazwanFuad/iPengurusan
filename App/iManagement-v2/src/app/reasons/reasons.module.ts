import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReasonsPageRoutingModule } from './reasons-routing.module';

import { ReasonsPage } from './reasons.page';

// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReasonsPageRoutingModule,
    CalendarModule
  ],
  declarations: [ReasonsPage]
})
export class ReasonsPageModule {}
