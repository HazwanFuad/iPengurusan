import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewreasonPageRoutingModule } from './viewreason-routing.module';

import { ViewreasonPage } from './viewreason.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewreasonPageRoutingModule
  ],
  declarations: [ViewreasonPage]
})
export class ViewreasonPageModule {}
