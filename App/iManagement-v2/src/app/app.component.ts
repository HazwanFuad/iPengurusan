import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { SqliteService } from './services/sqlite.service';
import { Router } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SharedService } from './services/shared.service';



export const environment = {
  oauthLogoutUrl: 'http://10.137.81.174/imanagement/login/logout',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean;
  public IntervalName: any;
  name: any;
  ic: any;
  public role: any;
  public tab: any;
  public totalNumberReason = null;
  public totalNumberCourses = null;
  public UserDetails = {};
  public staffid = {};
  public count = 'No';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    public sqlite: SqliteService,
    public apiService: ApiService,
    private authguard: AuthGuardService,
    private router: Router,
    private iab: InAppBrowser,
    private nativeStorage: NativeStorage,
    private sharedservice: SharedService

    ) {
      this.UserName();
      this.getPersonal();
      this.countTotalReasonApproval();
      this.initializeApp();
      this.countTotalCourses();
    }

  ngOnInit() {
    const subscription = this.sharedservice.getEmittedValue2()
    .subscribe(item => {
      this.count = item;
      if (this.count === 'Yes') {
        this.countTotalReasonApproval();
        this.countTotalCourses();
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.sqlite.createDb();
      this.sqlite.createDbSession();
      this.platform.ready().then(() => {
        this.statusBar.styleLightContent();
        this.authguard.isLoggedIn().then(
          data => {
            this.isLoggedIn = data;
            if (this.isLoggedIn) {
              this.router.navigate(['/userdashboard'], { replaceUrl: true });
            } else {
              this.router.navigate(['/login'], { replaceUrl: true });
            }
          }
        );
      });
    });
  }

  async countTotalReasonApproval() {
    this.sqlite.getTotalNumberOfAlasanApproval().then((data) => {
      this.totalNumberReason = data[0].total;
    }, err => console.error(err));
  }

  async countTotalCourses() {
    this.sqlite.getTotalNumberOfLulusTugasLuar().then((data) => {
      this.totalNumberCourses = data[0].total;
    }, err => console.error(err));
  }

  refresh() {
    this.apiService.fetchAllApi();
  }

  logout() {
    const location = environment.oauthLogoutUrl;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
      toolbar: 'no',
      mediaPlaybackRequiresUserAction: 'yes',
      clearsessioncache: 'yes'
    };
    const browser = this.iab.create(location, '_blank', options);
    browser.on('loadstart').subscribe(async event => {
      if (event.url.includes('http://10.137.81.174')) {
        browser.close();
        this.menuCtrl.close();
        this.nativeStorage.remove('access_token');
        this.sqlite.dropDb();
        this.sqlite.dropDbSession();
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  async UserName()
  {
    this.IntervalName = setInterval(() => {this.getPersonal(); }, 10000);
  }


  async getPersonal() {
     this.sqlite.getPersonalInfo().then((data) => {
      this.UserDetails = data;
      this.staffid = this.UserDetails[0].staffId;
      this.name = this.UserDetails[0].staffName;
      this.ic =  this.UserDetails[0].icNumber;
      this.role = this.UserDetails[0].role;

      if (this.role === 'pegawai') {
        this.tab = 1;
      } else if (this.role === 'pelulus') {
        this.tab = 2;
      }
    }, err => console.error(err));
  }

}
