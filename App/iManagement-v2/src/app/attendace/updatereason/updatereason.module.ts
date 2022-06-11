import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatereasonPageRoutingModule } from './updatereason-routing.module';

import { UpdatereasonPage } from './updatereason.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdatereasonPageRoutingModule
  ],
  declarations: [UpdatereasonPage]
})
export class UpdatereasonPageModule {}
