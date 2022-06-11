import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { MenuController, Platform, IonRouterOutlet } from '@ionic/angular';
import { formatDate } from '@angular/common';

const { App } = Plugins;

export const environment = {

  oauthClientId: '4eqZZiRmLWEV8CpnU1R9yFmvU2DNc9v0teX9wmfx',
  oauthLoginUrl: 'http://10.137.81.174/callback-mobile',
  oauthTokenUrl: 'http://10.137.81.174/o/token',
  oauthCallbackUrl: 'https://oauth.pstmn.io/v1/callback/',
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public accessToken = '';
  public codeVerifier = '';
  public exitCount = 0;
  public isToastShown = false;
  public hostname = '';
  public protocol = '';
  public today = {};

  constructor(
    private iab: InAppBrowser,
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    public apiService: ApiService,
    public menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
  ) {

    this.getDate();

    this.platform.backButton.subscribeWithPriority(-1, async () => {
      this.exitCount++;
      const toast = await this.toastCtrl.create({
        message: 'SILA TEKAN SEKALI LAGI UNTUK KELUAR.',
        color: 'medium',
        mode: 'ios',
        animated: true,
        translucent: true,
        cssClass: 'toast-exit-class',
        duration: 2000
      });
      if (!this.isToastShown) {
        this.isToastShown = !this.isToastShown;
        await toast.present();
      }
      setTimeout(() => {
        this.exitCount = 0;
        this.isToastShown = !this.isToastShown;
      }, 2000);
      if (!this.routerOutlet.canGoBack() && this.exitCount >= 2) {
        App.exitApp();
      }
    });
  }

  async showToastAlert() {
    const toast = await this.toastCtrl.create({
      message: 'DATA SEDANG DIKEMASKINI. APLIKASI MEMERLUKAN SEDIKIT MASA UNTUK MENGEMASKINI SENARAI.',
      color: 'dark',
      duration: 35000
    });
    await toast.present().then( () => {
      this.router.navigate(['/userdashboard'], { replaceUrl: true });
      this.apiService.fetchOtherApi();
    }
    );
  }

  private strRandom(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  openweb() {
    let url = '';
    const state = this.strRandom(40);
    this.codeVerifier = this.strRandom(128);
    const params = [
      'response_type=token',
      'state=' + state,
      'client_id=' + environment.oauthClientId,
      'code_challenge=' + this.codeVerifier,
      'code_challenge_method=plain',
      'redirect_uri=' + environment.oauthCallbackUrl,
      'scope=read%20write'
    ];
    const location = environment.oauthLoginUrl + '?' + params.join('&');
    console.log('URL location :' + location);
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      mediaPlaybackRequiresUserAction: 'yes',
      shouldPauseOnSuspend: 'yes',
      usewkwebview: 'yes',
      clearcache: 'yes',
      clearsessioncache: 'yes'
    };
    const browser = this.iab.create(location, '_blank', options);
    browser.on('loadstop').subscribe(async event => {
      if (event.url.includes('access_token')) {
        url = event.url;
        browser.close();
        const arrayUrl = url.split('=');
        const arrayUrl2 = arrayUrl[1].split('&');
        this.accessToken = arrayUrl2[0];
        if (!this.accessToken.includes('null')) {
          this.nativeStorage.setItem('access_token', this.accessToken)
            .then(
              async () => {
                this.apiService.fetchApiDashboard();
                console.log('Stored access_token!');
                const loading = await this.loadingController.create({
                  cssClass: 'my-custom-class',
                  message: 'Please wait...',
                });
                await loading.present();
                setTimeout(() => {
                  loading.dismiss();
                  this.router.navigate(['/userdashboard'], { replaceUrl: true });
                  this.showToastAlert();
                }, 15000);
              },
              error => console.error('Error storing access_token', error)
            );
        } else {
          const alert = await this.alertController.create({
            header: 'Login Failed',
            message: 'Cannot connect to Authentication Server. Please retry later.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                }
              }
            ]
          });
          await alert.present();
        }
      }
    });
  }

  ngOnInit() {
    this.hostname = window.location.hostname;
    this.protocol = window.location.protocol;

  }

  getDate() {
    const now = new Date().getFullYear();
    this.today = now;
  }

}
