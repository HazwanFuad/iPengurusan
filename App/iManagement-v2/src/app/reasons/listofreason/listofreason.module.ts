import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListofreasonPageRoutingModule } from './listofreason-routing.module';

import { ListofreasonPage } from './listofreason.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListofreasonPageRoutingModule
  ],
  declarations: [ListofreasonPage]
})
export class ListofreasonPageModule {}
