import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SipCalculatorPageRoutingModule } from './sip-calculator-routing.module';

import { SipCalculatorPage } from './sip-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SipCalculatorPageRoutingModule
  ],
  declarations: [SipCalculatorPage]
})
export class SipCalculatorPageModule {}
