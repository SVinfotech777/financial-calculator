import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sip-calculator',
  templateUrl: './sip-calculator.page.html',
  styleUrls: ['./sip-calculator.page.scss'],
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
    await this.prepareInterstitial();
  }

  async initialize() {
    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true,
    }).then(
      (res) => {
        console.log('res: initialize', res);
      },
      (err) => {
        console.log('err: initialize', err);
      }
    );
  }

  banner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3228515841874235/4177251874',
      adSize: BannerAdSize.FULL_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: !environment.production,
      // npa: true
    };
    AdMob.showBanner(options).then(
      (res) => {
        console.log('res: showbanner', res);
        this.isShowBanner = true;
      },
      (err) => {
        console.log('err: showbanner', err);
      }
    );
  }

  async prepareInterstitial() {
    const options: AdOptions = {
      adId: 'ca-app-pub-3228515841874235/6851516676',
      isTesting: !environment.production
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  // calculate value
  async calculateValue() {

    let errMsg = '';
    if(!this.monthlyInvestment) {
      errMsg = "Please enter monthly investment amount"
    } else if(!this.returnRate) {
      errMsg = "Please enter return rate";
    } else if(!this.totalYears) {
      errMsg = "Please enter total years"
    }

    if(errMsg) {
      await this.presentToast(errMsg);
      return;
    } 

    if(this.clickedCount == 3) {
      await this.prepareInterstitial().then(() => {
        console.log("90");
      }, (err) => {
        console.log('err: 92', err);
      });
      this.clickedCount = 0;
    }
    console.log('this.clickedCount: ', this.clickedCount);
    this.clickedCount++;
    var investment = this.monthlyInvestment; //principal amount
    var annualRate = this.returnRate; 
    var monthlyRate = annualRate / 12 / 100;  //Rate of interest
    var years = this.totalYears; 
    var months = years * 12;  //Time period 
    this.totalInvestment = (months * investment).toLocaleString('en-IN');

    this.totalValue = Math.floor(investment * (Math.pow(1 + monthlyRate, months) - 1) /monthlyRate).toLocaleString('en-IN');
    this.estimatedReturns = (Math.floor(Number(investment * (Math.pow(1 + monthlyRate, months) - 1) /monthlyRate) - Number(months * investment))).toLocaleString('en-IN')
  }

  // reset value
  async resetValue() {
    await this.prepareInterstitial().then(() => {
      console.log("112");
    }, (err) => {
      console.log('err: 114', err);
    });
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
