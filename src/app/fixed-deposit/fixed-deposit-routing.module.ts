import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FixedDepositPage } from './fixed-deposit.page';

const routes: Routes = [
  {
    path: '',
    component: FixedDepositPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FixedDepositPageRoutingModule {}
