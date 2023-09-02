import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SipCalculatorPage } from './sip-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: SipCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SipCalculatorPageRoutingModule {}
