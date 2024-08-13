import { Component } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    this.initializeAdmob();
  }

  async initializeAdmob() {
    await AdMob.initialize({
      initializeForTesting: true,
    });
  }
}
