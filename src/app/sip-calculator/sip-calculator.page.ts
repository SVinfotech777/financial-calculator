import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sip-calculator',
  templateUrl: './sip-calculator.page.html',
  styleUrls: ['../../common.scss', './sip-calculator.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf
  ],
})
export class SipCalculatorPage implements OnInit {

  totalInvestment: any;
  estimatedReturns: any;
  totalValue: any;
  clickedCount: number = 0;
  sipForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.sipForm = this.fb.group({
      monthlyInvestment: ['', {
        validators: [Validators.required],
      }],
      returnRate: ['', {
        validators: [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/) // Regex to ensure max two decimal places
        ],
      }],
      totalYears: ['', {
        validators: [Validators.required],
      }]
    });
    await this.banner();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.sipForm.controls;
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

  // calculate value
  async calculateValue() {
    const sipData = this.sipForm.value;
    this.clickedCount++;
    var investment = sipData.monthlyInvestment; //principal amount
    var annualRate = sipData.returnRate;
    var monthlyRate = annualRate / 12 / 100;  //Rate of interest
    var years = sipData.totalYears;
    var months = years * 12;  //Time period
    this.totalInvestment = (months * investment).toLocaleString('en-IN');

    this.totalValue = Math.floor(investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate).toLocaleString('en-IN');
    this.estimatedReturns = (Math.floor(Number(investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) - Number(months * investment))).toLocaleString('en-IN');
  }

  // reset value
  async resetValue() {
    this.sipForm.reset()
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
