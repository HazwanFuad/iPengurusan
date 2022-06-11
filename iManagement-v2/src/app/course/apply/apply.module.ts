import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplyPageRoutingModule } from './apply-routing.module';

import { ApplyPage } from './apply.page';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplyPageRoutingModule,
    CalendarModule
  ],
  declarations: [ApplyPage]
})
export class ApplyPageModule {}
