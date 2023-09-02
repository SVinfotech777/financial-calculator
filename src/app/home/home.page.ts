import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AdMob,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  categoriesList: any[] = [
    {
      name: "SIP", // Systematic Investment Plan
      route: 'sip-calculator'
    },
    {
      name: "Loan",
      route: 'loan'
    },
    // {
    //   name: "Fixed Deposit",
    //   route: 'fixed-deposit'
    // }
  ]

  constructor(public router: Router) {}

  async ngOnInit() {
    await this.initialize();
    this.banner();
  }

  async initialize() {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true,
    })
  }

  isShowBanner: boolean = false;
  async banner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3228515841874235/6330424887',
      adSize: BannerAdSize.FULL_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };
    await AdMob.showBanner(options)
    this.isShowBanner = true;
  }


  async openCalculator(item) {
    if (this.isShowBanner) AdMob.removeBanner();
    await this.router.navigate([item.route])
  }

  ngonDestroy() {
    if (this.isShowBanner) AdMob.removeBanner();
  }

  async openSettingsPage() {
    this.router.navigate(['/side-menu']);
  }

  closeApp() {
    navigator['app'].exitApp();
  }
}
