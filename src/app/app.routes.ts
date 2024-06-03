import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes')
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sip-calculator',
    loadChildren: () => import('./sip-calculator/sip-calculator.routes')
  },
  {
    path: 'loan',
    loadChildren: () => import('./loan/loan.routes')
  },
  {
    path: 'side-menu',
    loadChildren: () => import('./side-menu/side-menu.routes')
  },
  {
    path: 'fixed-deposit',
    loadChildren: () => import('./fixed-deposit/fixed-deposit.routes')
  }
];
