import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FixedDepositPageRoutingModule } from './fixed-deposit-routing.module';

import { FixedDepositPage } from './fixed-deposit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FixedDepositPageRoutingModule
  ],
  declarations: [FixedDepositPage]
})
export class FixedDepositPageModule {}
