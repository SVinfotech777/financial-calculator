import { NgFor } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize
} from '@capacitor-community/admob';
import { App } from '@capacitor/app';
import { IonicModule, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgFor],
})
export class HomePage {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  categoriesList: any[] = [
    {
      name: "Loan",
      route: 'loan',
      icon: 'assets/imgs/loan.jpeg'
    },
    {
      name: "SIP", // Systematic Investment Plan
      route: 'sip-calculator',
      icon: 'assets/imgs/sip.jpeg'
    },
    // {
    //   name: "Fixed Deposit",
    //   route: 'fixed-deposit'
    // }
  ];

  constructor(public router: Router,
    private platform: Platform,
    private toastCtrl: ToastController) { }

  async ngOnInit() {
    // this.banner();
    this.startTimer();
  }

  startTimer() {
    setInterval(() => {
      if (this.count > 10) return;
      this.count++;
      if (this.count >= 11) {
        this.isBtnEnable = true;
        // this.resetTimer();
      }
    }, 1000);
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
    await AdMob.showBanner(options);
    this.isShowBanner = true;

    // Reload banner ad every 1 minute
    this.timeInterval = setInterval(async () => {
      await AdMob.removeBanner(); // Remove the existing banner
      this.banner();
    }, 60000); // 60,000 milliseconds = 1 minute
  }


  async openCalculator(item) {
    if (this.isShowBanner) AdMob.removeBanner();
    await this.router.navigate([item.route]);
  }

  ngonDestroy() {
    if (this.isShowBanner) AdMob.removeBanner();
  }

  async openSettingsPage() {
    this.router.navigate(['/side-menu']);
  }

  closeApp() {
    App.exitApp();
  }

  async handleAndroidBackButton() {
    if (this.platform.is('android') && this.platform.is('capacitor')) {
      let lastTimeBackPress = 0;
      const timePeriodToExit = 2000;
      this.platform.backButton.subscribeWithPriority(0, () => {
        if (this.router.url === '/home') {
          if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
            App.exitApp();
          } else {
            this.showToaster('Press back again to exit app');
            lastTimeBackPress = new Date().getTime();
          }
        } else if (this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
        } else if (history.length) {
          window.history.back();
        }
      });
    }
  }

  async showToaster(text: string, cssClass?: string) {
    const toasterRef = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
      cssClass: cssClass || '',
      mode: 'ios',
    });
    toasterRef.present();
  }


  isBtnEnable = false;
  count = 0;
  timeInterval;

  resetTimer() {
    this.count = 0;
    this.isBtnEnable = false;
    clearInterval(this.timeInterval);
  }

}
