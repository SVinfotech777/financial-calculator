import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { AlertService } from '../provider/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.page.html',
  styleUrls: ['./loan.page.scss'],
})
export class LoanPage implements OnInit {

  loanAmount: any;
  annualRate: any;
  loanTeam: any;
  monthlyRepayment: any;
  principalPaid: any;
  interestPaid: any;
  totalRepaymentsPaid: any;
  clickedCount: number = 0;

  constructor(private alertService: AlertService, private router: Router) { }

  async ngOnInit() {
    await this.initialize();
    await this.prepareInterstitial();
    await this.banner();
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

  isShowBanner: boolean = false;
  banner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3228515841874235/2050029406',
      adSize: BannerAdSize.FULL_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: !environment.production
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
      adId: 'ca-app-pub-3228515841874235/8765016530',
      isTesting: !environment.production
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }


  // calculate value
  async calculateValue() {
    let errMsg = '';
    if(!this.loanAmount) {
      errMsg = "Please enter loan amount"
    } else if(!this.annualRate) {
      errMsg = "Please enter annual rate";
    } else if(!this.loanTeam) {
      errMsg = "Please select total years"
    }

    if(errMsg) {
      await this.alertService.presentToast(errMsg);
      return;
    } 

    if(this.clickedCount == 3) {
      await this.prepareInterstitial().then(() => {
        console.log("89");
      }, (err) => {
        console.log('err: 91', err);
      });;
      this.clickedCount = 0;
    }
    console.log('this.clickedCount: ', this.clickedCount);
    
    this.clickedCount++;
    var p = this.loanAmount; //principal amount
    var annualRate = this.annualRate; 
    var i = annualRate / 12 / 100;  //Rate of interest
    var years = this.loanTeam; 
    var n = years * 12;  //Time period 

    // Monthly Repayment
    let monthlyRepayment = (p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1));
    this.monthlyRepayment = monthlyRepayment.toLocaleString("en-IN")

    // principal Paid (P)
    this.principalPaid = p.toLocaleString("en-IN");

    // Interest Paid (I)
    let interestPaid = (monthlyRepayment * n) - p;
    this.interestPaid = interestPaid.toLocaleString("en-IN")

    // Total Repayments Paid(P + I)
    this.totalRepaymentsPaid = (p + interestPaid).toLocaleString("en-IN")

  }

  // reset value
  async resetValue() {
    await this.prepareInterstitial().then(() => {
      console.log("123");
    }, (err) => {
      console.log('err: 125', err);
    });;
    this.loanAmount = '';
    this.annualRate = '';
    this.loanTeam = '';

    this.monthlyRepayment = '';
    this.principalPaid = '';
    this.interestPaid = '';
    this.totalRepaymentsPaid = '';
  }

  async presentToast(errorMsg) {
    await this.alertService.presentToast(errorMsg);
  }

  ngonDestroy() {
    if (this.isShowBanner) AdMob.removeBanner();
  }

}
