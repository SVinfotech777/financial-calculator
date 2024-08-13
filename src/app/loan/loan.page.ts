import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { IonicModule } from '@ionic/angular';
import { AlertService } from '../provider/alert.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.page.html',
  styleUrls: ['../../common.scss', './loan.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgFor,
    NgIf,
    CurrencyPipe
  ],
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
  repaymentSchedule: any[] = [];
  a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen '];
  b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'];
  loanAmountInWords: string = '';


  constructor(private alertService: AlertService, private router: Router) { }

  async ngOnInit() {
    await this.initialize();
    // await this.prepareInterstitial();
    await this.banner();

    // Get the input element by ID
    const inputElement = document.getElementById('loanAmount') as HTMLInputElement;
    // Add an event listener to track the input
    inputElement.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.inWords(target.value);
    });
  }

  async initialize() {
    await AdMob.initialize({
      initializeForTesting: true,
    });
  }

  isShowBanner: boolean = false;
  banner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3228515841874235/2050029406',
      adSize: BannerAdSize.FULL_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };
    AdMob.showBanner(options).then(() => {
      this.isShowBanner = true;
    });
  }

  async prepareInterstitial() {
    const options: AdOptions = {
      adId: 'ca-app-pub-3228515841874235/8765016530',
      isTesting: true
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex % 12];
  }


  // calculate value
  async calculateValue() {
    let errMsg = '';
    if (!this.loanAmount) {
      errMsg = "Please enter loan amount";
    } else if (!this.annualRate) {
      errMsg = "Please enter annual rate";
    } else if (!this.loanTeam) {
      errMsg = "Please select total years";
    }

    if (errMsg) {
      await this.alertService.presentToast(errMsg);
      return;
    }

    if (this.clickedCount == 3) {
      await this.prepareInterstitial();
      this.clickedCount = 0;
    }

    this.clickedCount++;
    const principal = this.loanAmount;
    const annualInterestRate = this.annualRate / 100;
    const loanTerm = this.loanTeam;
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanTerm * 12;


    // Monthly Repayment
    const monthlyPayment = principal * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    this.monthlyRepayment = monthlyPayment.toLocaleString("en-IN");

    // principal Paid (P)
    this.principalPaid = principal.toLocaleString("en-IN");

    // Interest Paid (I)
    let interestPaid = (monthlyPayment * numberOfPayments) - principal;
    this.interestPaid = interestPaid.toLocaleString("en-IN");

    // Total Repayments Paid(P + I)
    this.totalRepaymentsPaid = (principal + interestPaid).toLocaleString("en-IN");

    let remainingBalance = principal;
    this.repaymentSchedule = [];

    const startDate = new Date(); // Assume the loan starts in the current month
    let currentMonthIndex = startDate.getMonth();
    let currentYear = startDate.getFullYear();


    //
    for (let i = 0; i < numberOfPayments; i++) {
      const interest = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interest;
      remainingBalance -= principalPayment;

      const monthName = this.getMonthName(currentMonthIndex);
      this.repaymentSchedule.push({
        month: `${monthName} ${currentYear}`,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interest,
        remainingBalance: remainingBalance
      });

      currentMonthIndex++;
      if (currentMonthIndex >= 12) {
        currentMonthIndex = 0;
        currentYear++;
      }
    }

  }

  // reset value
  async resetValue() {
    await this.prepareInterstitial();
    this.loanAmount = '';
    this.annualRate = '';
    this.loanTeam = '';

    this.monthlyRepayment = '';
    this.principalPaid = '';
    this.interestPaid = '';
    this.totalRepaymentsPaid = '';
    this.repaymentSchedule = [];
    this.loanAmountInWords = '';
  }

  async presentToast(errorMsg) {
    await this.alertService.presentToast(errorMsg);
  }

  ngonDestroy() {
    if (this.isShowBanner) AdMob.removeBanner();
  }

  inWords(value: any): any {
    if (value) {
      let number = parseFloat(value).toFixed(2).split(".");
      let num = parseInt(number[0]);
      let digit = parseInt(number[1]);
      if (num) {
        if ((num.toString()).length > 9) { return ''; }
        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        const d = ('00' + digit).substr(-2).match(/^(\d{2})$/);
        if (!n) { return ''; }
        let str = '';
        str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'Crore ' : '';
        str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'Lakh ' : '';
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'Thousand ' : '';
        str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'Hundred ' : '';
        str += (Number(n[5]) !== 0) ? (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'Rupee ' : '';
        str += (Number(d[1]) !== 0) ? ((str !== '') ? "and " : '') + (this.a[Number(d[1])] || this.b[d[1][0]] + ' ' + this.a[d[1][1]]) + 'Paise Only' : 'Only';
        this.loanAmountInWords = str;
      } else {
        this.loanAmountInWords = '';
        return '';
      }
    } else {
      this.loanAmountInWords = '';
      return '';
    }
  }

  async copyWords() {
    this.alertService.presentToast("Copied")
    await Clipboard.write({string: this.loanAmountInWords})
  }

}
