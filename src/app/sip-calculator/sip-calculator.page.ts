import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sip-calculator',
  templateUrl: './sip-calculator.page.html',
  styleUrls: ['../../common.scss', './sip-calculator.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgFor,
    NgIf
  ],
})
export class SipCalculatorPage implements OnInit {

  totalInvestment: any;
  estimatedReturns: any;
  totalValue: any;

  totalYears: any;
  returnRate: any;
  monthlyInvestment: any;
  clickedCount: number = 0;

  constructor(private router: Router, private toastController: ToastController) { }

  async ngOnInit() {
    await this.initialize();
    await this.banner();
    // await this.prepareInterstitial();
  }

  async initialize() {
    await AdMob.initialize({
      initializeForTesting: false,
    });
  }

  banner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3228515841874235/4177251874',
      adSize: BannerAdSize.FULL_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };
    AdMob.showBanner(options).then(
      () => {
        this.isShowBanner = true;
      });
  }

  async prepareInterstitial() {
    const options: AdOptions = {
      adId: 'ca-app-pub-3228515841874235/6851516676',
      isTesting: true
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  // calculate value
  async calculateValue() {

    let errMsg = '';
    if (!this.monthlyInvestment) {
      errMsg = "Please enter monthly investment amount";
    } else if (!this.returnRate) {
      errMsg = "Please enter return rate";
    } else if (!this.totalYears) {
      errMsg = "Please enter total years";
    }

    if (errMsg) {
      await this.presentToast(errMsg);
      return;
    }

    // if (this.clickedCount == 3) {
    //   await this.prepareInterstitial();
    //   this.clickedCount = 0;
    // }
    this.clickedCount++;
    var investment = this.monthlyInvestment; //principal amount
    var annualRate = this.returnRate;
    var monthlyRate = annualRate / 12 / 100;  //Rate of interest
    var years = this.totalYears;
    var months = years * 12;  //Time period
    this.totalInvestment = (months * investment).toLocaleString('en-IN');

    this.totalValue = Math.floor(investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate).toLocaleString('en-IN');
    this.estimatedReturns = (Math.floor(Number(investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) - Number(months * investment))).toLocaleString('en-IN');
  }

  // reset value
  async resetValue() {
    // await this.prepareInterstitial();
    this.monthlyInvestment = '';
    this.returnRate = '';
    this.totalYears = '';
    this.totalInvestment = '';
    this.estimatedReturns = '';
    this.totalValue = '';
  }

  async presentToast(errorMsg) {
    const toast = await this.toastController.create({
      message: errorMsg,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  isShowBanner: boolean = false;
  ngonDestroy() {
    if (this.isShowBanner) AdMob.removeBanner();
  }
}
