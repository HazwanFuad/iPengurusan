import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserdashboardPageRoutingModule } from './userdashboard-routing.module';

import { UserdashboardPage } from './userdashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserdashboardPageRoutingModule
  ],
  declarations: [UserdashboardPage]
})
export class UserdashboardPageModule {}
