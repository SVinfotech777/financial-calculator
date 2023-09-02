import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sip-calculator',
    loadChildren: () => import('./sip-calculator/sip-calculator.module').then( m => m.SipCalculatorPageModule)
  },
  {
    path: 'loan',
    loadChildren: () => import('./loan/loan.module').then( m => m.LoanPageModule)
  },
  {
    path: 'side-menu',
    loadChildren: () => import('./side-menu/side-menu.module').then( m => m.SideMenuPageModule)
  },
  {
    path: 'fixed-deposit',
    loadChildren: () => import('./fixed-deposit/fixed-deposit.module').then( m => m.FixedDepositPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
