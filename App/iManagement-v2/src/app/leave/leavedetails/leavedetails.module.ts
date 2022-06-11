import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeavedetailsPageRoutingModule } from './leavedetails-routing.module';

import { LeavedetailsPage } from './leavedetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeavedetailsPageRoutingModule
  ],
  declarations: [LeavedetailsPage]
})
export class LeavedetailsPageModule {}
