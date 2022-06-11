import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { ApiService } from '../services/api.service';
import { IonRouterOutlet, Platform, ToastController, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from '../app.component';
import { formatDate } from '@angular/common';
const { App } = Plugins;


@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.page.html',
  styleUrls: ['./userdashboard.page.scss'],
})
export class UserdashboardPage implements OnInit {

  public personal = {};
  public totalcourse = {};
  public cardcolor = {};
  public leave = {};
  public workhour = {};
  public inout = {};
  public inout2 = {};
  public today = {};
  public waktumasuk = {};
  public jumlahhari = null;
  public jumlahcuti = null;
  public newwaktukerjasec = null;
  public gethour = {};
  public wmasukmin = {};
  public whour = {};
  public whuser = {};
  public comeinearly = null;
  public comeinlate = null;
  public wkeluar = null;
  public totalNumberCourses = {};
  public countTotalKehadiran = {};
  public totalNumberLeave = {};
  public staffid = {};
  public exitCount = 0;
  public isToastShown = false;
  public role: any;
  public totalNumberReason = null;

  ionViewDidEnter() {
    this.refreshDashboard();
  }

  constructor(
    private sqlite: SqliteService,
    public apiService: ApiService,
    private platform: Platform,
    private toastCtrl: ToastController,
    private routerOutlet: IonRouterOutlet,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private iab: InAppBrowser,
    public menuCtrl: MenuController,
    private nativeStorage: NativeStorage
  ) {
    this.getPersonal();
    this.getTimeInandOut();
    this.getTimeInandOut2();
    this.getCourse();
    this.getCardColor();
    this.getLeave();
    this.getDate();
    this.getWorkHour();
    this.countTotalCourses();
    this.countTotalLeave();
    this.countTotalkehadiran();
    this.checkSession();

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

  ngOnInit() {

  }

  async refreshDashboard() {

    this.sqlite.deleteTimeInOut();
    this.sqlite.deleteTotalLeave();
    this.sqlite.deleteTotalCourse();
    this.sqlite.deleteAlasanKehadiran();
    this.sqlite.deleteKehadiranIndividu();
    this.sqlite.deleteKehadiranLewat();
    this.sqlite.deleteKehadiranKIV();
    this.sqlite.deleteCutiUmum();
    this.sqlite.deleteKehadiranCuti();
    this.sqlite.deleteKehadiranTugasLuar();

    setTimeout(async () => {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Updating Data...',
      });
      await loading.present();
      this.apiService.refreshApiDashboard().then(async () => {
        setTimeout(async () => {
          this.sqlite.getTotalNumberOfCourse().then((data1) => {
            this.countTotalCourses = data1[0].total;
            loading.dismiss();
            this.sqlite.getTotalNumberOfLeave().then((data2) => {
              this.countTotalLeave = data2[0].total;
              loading.dismiss();
              this.sqlite.getTotalNumberOfKehadiran().then((data3) => {
                this.countTotalkehadiran = data3[0].total;
                loading.dismiss();
                this.sqlite.getTimeIn().then((data4) => {
                  this.inout = data4;
                  const getwaktumasuk = this.inout[0].thisTime;

                  if (getwaktumasuk < '09:00:00') {
                    this.comeinearly = getwaktumasuk;
                    loading.dismiss();
                  } else {
                    this.comeinlate = getwaktumasuk;
                    loading.dismiss();
                  }

                  const getwaktumasuk2 = getwaktumasuk;
                  const splitzer = getwaktumasuk2.split(':');

                  const hour = (+splitzer[0]) * 3600;
                  const hours = hour / 3600;
                  this.gethour = hours;

                  const minutes = (+splitzer[1]) * 60;
                  const min = minutes / 60;
                  this.wmasukmin = min;

                  if (this.wmasukmin < 10) {
                    this.waktumasuk = '0' + this.wmasukmin;
                    loading.dismiss();
                  } else {
                    this.waktumasuk = this.wmasukmin;
                    loading.dismiss();
                  }
                  this.sqlite.getTimeOut().then((data5) => {
                    this.inout2 = data5;
                    const waktukeluar = this.inout2[0].thisTimeOut;
                    const getwaktukeluar = waktukeluar;

                    if ((getwaktukeluar !== null)) {
                      this.wkeluar = waktukeluar;
                      loading.dismiss();
                    } else {
                      this.wkeluar = null;
                      loading.dismiss();
                    }
                    this.sqlite.getWaktuKerja().then((data6) => {
                      this.workhour = data6;

                      const addwaktukerja = '09:00';
                      const splitwaktukerja = addwaktukerja.split(':');
                      const seconds = (+splitwaktukerja[0]) * 3600;
                      const newhour1 = seconds / 3600;
                      const waktukerja = newhour1;
                      const wkerjacvt = (waktukerja + hours) + ':' + this.waktumasuk;
                      const wkerjahm = wkerjacvt;

                      this.newwaktukerjasec = wkerjahm;
                      loading.dismiss();
                    }, err => console.error(err));
                  }, err => console.error(err));
                }, err => console.error(err));
              }, err => console.error(err));
            }, err => console.error(err));
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 2000);
  }

  async refreshPage(event) {

    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.totalNumberCourses = [];
    this.countTotalKehadiran = [];
    this.totalNumberLeave = [];
    this.personal = [];
    this.staffid = [];
    this.jumlahhari = [];
    this.cardcolor = [];
    this.jumlahcuti = [];
    this.comeinearly = [];
    this.comeinlate = [];
    this.newwaktukerjasec = [];
    this.wkeluar = [];
    this.whuser = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        setTimeout(async () => {
          await this.sqlite.getPersonalInfo().then((data) => {
            this.personal = data;
            this.staffid = this.personal[0].staffId;
            event.target.complete();
            this.sqlite.getTotalCourse().then((data1) => {
              this.jumlahhari = data1[0].total;
              event.target.complete();
              this.sqlite.getTotalNumberOfKehadiran().then((data2) => {
                this.countTotalkehadiran = data2[0].total;
                event.target.complete();
                this.sqlite.getTotalNumberOfCourse().then((data3) => {
                  this.countTotalCourses = data3[0].total;
                  event.target.complete();
                  this.sqlite.getTotalNumberOfLeave().then((data4) => {
                    this.countTotalLeave = data4[0].total;
                    event.target.complete();
                    this.sqlite.getColour().then((data5) => {
                      this.cardcolor = data5;
                      event.target.complete();
                      this.sqlite.getLeave().then((data6) => {
                        this.jumlahcuti = data6[0].total;
                        event.target.complete();
                        this.sqlite.getWaktuKerja().then((data7) => {
                          this.whuser = data7;
                          event.target.complete();
                          this.sqlite.getTimeIn().then((data8) => {
                            this.inout = data8;
                            const getwaktumasuk = this.inout[0].thisTime;

                            if (getwaktumasuk < '09:00:00') {
                              this.comeinearly = getwaktumasuk;
                              event.target.complete();
                            } else {
                              this.comeinlate = getwaktumasuk;
                              event.target.complete();
                            }

                            const getwaktumasuk2 = getwaktumasuk;

                            const splitzer = getwaktumasuk2.split(':');

                            // convert hour (waktu masuk)
                            const hour = (+splitzer[0]) * 3600;
                            const hours = hour / 3600;
                            this.gethour = hours;

                            // convert min (waktu masuk)
                            const minutes = (+splitzer[1]) * 60;
                            const min = minutes / 60;
                            this.wmasukmin = min;

                            if (this.wmasukmin < 10) {
                              this.waktumasuk = '0' + this.wmasukmin;
                            } else {
                              this.waktumasuk = this.wmasukmin;
                            }
                            // get waktu tamat bertugas
                            this.sqlite.getWaktuKerja().then((data9) => {
                              this.workhour = data9;

                              const addwaktukerja = '09:00';
                              const splitwaktukerja = addwaktukerja.split(':');

                              // convert hour (waktu tamat bertugas)
                              const seconds = (+splitwaktukerja[0]) * 3600;
                              const newhour1 = seconds / 3600;
                              const waktukerja = newhour1;
                              const wkerjacvt = (waktukerja + hours) + ':' + this.waktumasuk;
                              const wkerjahm = wkerjacvt;

                              this.newwaktukerjasec = wkerjahm;
                              event.target.complete();
                              this.sqlite.getTimeOut().then((data10) => {

                                this.inout2 = data10;
                                const waktukeluar = this.inout2[0].thisTimeOut;
                                const getwaktukeluar = waktukeluar;

                                if ((getwaktukeluar !== null)) {
                                  this.wkeluar = waktukeluar;
                                  event.target.complete();
                                } else {
                                  this.wkeluar = null;
                                  event.target.complete();
                                }
                              }, err => console.error(err));
                            }, err => console.error(err));
                          }, err => console.error(err));
                        }, err => console.error(err));
                      }, err => console.error(err));
                    }, err => console.error(err));
                  }, err => console.error(err));
                }, err => console.error(err));
              }, err => console.error(err));
            }, err => console.error(err));
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 500);
  }

  async countTotalCourses() {
    this.sqlite.getTotalNumberOfCourse().then((data) => {
      this.countTotalCourses = data[0].total;
    }, err => console.error(err));
  }

  async countTotalkehadiran() {
    this.sqlite.getTotalNumberOfKehadiran().then((data) => {
      this.countTotalkehadiran = data[0].total;
    }, err => console.error(err));
  }

  async countTotalLeave() {
    this.sqlite.getTotalNumberOfLeave().then((data) => {
      this.countTotalLeave = data[0].total;
    }, err => console.error(err));
  }

  async getDate() {
    this.sqlite.getWaktuSemasa().then((data) => {
      this.today = data;
    }, err => console.error(err));
  }

  async checkSession() {
    this.sqlite.getSessionTime().then((data) => {
      // get login time
      const lastupdate = data[0].tarikh;
      const newupdate = new Date(lastupdate);
      newupdate.setHours(newupdate.getHours() + 10);
      const SessionDay = formatDate(lastupdate, 'EEE', 'en-US'); // convert day
      const SessionStart = formatDate(lastupdate, 'HH:mm:ss', 'en-US'); // convert format
      const SessionEnd = formatDate(newupdate, 'HH:mm:ss', 'en-US');

      // get current time
      const now = new Date();
      const TimeNow = formatDate(now, 'HH:mm:ss', 'en-US');
      const CurrentDay = formatDate(now, 'EEE', 'en-US');

      // define time start and time end variable
      const TimeStart = TimeNow;
      const TimeEnd = TimeNow;

      // check session timeout
      if (SessionStart >= '00:00:00' && SessionStart <= '13:59:59') { // if login between 12:00 am to 13:59 pm
        if (SessionDay === CurrentDay) {
          if (SessionStart >= '00:00:00' && SessionStart <= '05:59:59') {
            if (TimeStart >= '00:00:00' && TimeStart <= '05:59:59') {
              this.sessionLiveClick();
            } else {
              this.sessionEndClick();
            }
          } else if (SessionStart >= '06:00:00' && SessionStart <= '13:59:59') {
            if (TimeEnd <= SessionEnd) {
              this.sessionLiveClick();
            } else {
              this.sessionEndClick();
            }
          } else {
            this.sessionEndClick();
          }
        } else {
          this.sessionEndClick();
        }
      } else if (SessionStart >= '14:00:00' && SessionStart <= '23:59:59') { // if login between 2:00 pm to 23:59 pm
        if (SessionDay !== CurrentDay) {
          if (TimeEnd >= '00:00:00' && TimeEnd <= '05:59:59') {
            if (TimeEnd <= SessionEnd) {
              this.sessionLiveClick();
            } else {
              this.sessionEndClick();
            }
          } else {
            this.sessionEndClick();
          }
        } else {
          this.sessionLiveClick();
        }
      } else {
        this.sessionEndClick();
      }

    }, err => console.error(err));
  }

  async sessionLiveClick() {
    this.sqlite.getTotalNumberOfKehadiran().then(async (data) => {
      this.countTotalKehadiran = data[0].total;
      this.sqlite.getPersonalInfo().then(async (data1) => {
        this.role = data1[0].role;

        if (this.role === 'pegawai') {
          if (this.countTotalKehadiran !== 0) {
            this.alertAlasanPegawai();
          }
        } else if (this.role === 'pelulus') {
          this.sqlite.getTotalNumberOfAlasanApproval().then(async (data2) => {
            this.totalNumberReason = data2[0].total;
            this.sqlite.getTotalNumberOfLulusTugasLuar().then(async (data3) => {
              this.totalNumberCourses = data3[0].total;
              // check counter senarai kelulusan/kehadiran
              if (this.countTotalKehadiran !== 0 && this.totalNumberReason === 0 && this.totalNumberCourses === 0) {
                this.alertTindakanKehadiran();
              } else if (this.countTotalKehadiran !== 0 && this.totalNumberReason !== 0 && this.totalNumberCourses === 0) {
                this.alertTindakanKehadiranAlasan();
              } else if (this.countTotalKehadiran !== 0 && this.totalNumberReason === 0 && this.totalNumberCourses !== 0) {
                this.alertTindakanKehadiranKursus();
              } else if (this.countTotalKehadiran === 0 && this.totalNumberReason !== 0 && this.totalNumberCourses === 0) {
                this.alertTindakanAlasan();
              } else if (this.countTotalKehadiran === 0 && this.totalNumberReason === 0 && this.totalNumberCourses !== 0) {
                this.alertTindakanKursus();
              } else if (this.countTotalKehadiran === 0 && this.totalNumberReason !== 0 && this.totalNumberCourses !== 0) {
                this.alertTindakanAlasanKursus();
              } else if (this.countTotalKehadiran !== 0 && this.totalNumberReason !== 0 && this.totalNumberCourses !== 0) {
                this.alertTindakanKehadiranAlasanKursus();
              }
            }, err => console.error(err));
          }, err => console.error(err));
        }
      }, err => console.error(err));
    }, err => console.error(err));
  }

  async sessionEndClick() {
    const alert = await this.alertController.create({
      message: 'Sesi anda telah tamat, sila log masuk semula ke aplikasi.',
      mode: 'ios',
      buttons: [{
        text: 'OK',
        cssClass: 'secondary',
        handler: () => {
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
            if (event.url.includes('http://109.167.100.174')) {
              browser.close();
              this.menuCtrl.close();
              this.nativeStorage.remove('access_token');
              this.sqlite.dropDb();
              this.sqlite.dropDbSession();
              this.router.navigate(['/login'], {
                replaceUrl: true
              });
            }
          });
        }
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  // senarai semua alert
  async alertAlasanPegawai() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br>Anda mempunyai alasan kehadiran.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanKehadiran() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br>Anda mempunyai alasan kehadiran.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanKehadiranAlasan() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br><b>Kelulusan</b><br><br>Anda mempunyai alasan kehadiran.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanKehadiranKursus() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br><b>Kelulusan</b><br><br>Anda mempunyai alasan kehadiran.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanAlasan() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br><b>Kelulusan</b><br>Anda mempunyai tindakan\nkelulusan alasan.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanKursus() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><b>Kelulusan</b><br>Anda mempunyai tindakan\nkelulusan kursus.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanAlasanKursus() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br><b>Kelulusan</b><br><br>Anda mempunyai tindakan\nkelulusan alasan.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async alertTindakanKehadiranAlasanKursus() {
    const alert = await this.alertController.create({
      message: '<img src="assets/img/alert.png" class="alert"><br><br><b>Kelulusan</b><br><br>Anda mempunyai alasan kehadiran.',
      mode: 'ios',
      buttons: [{
        text: 'Tutup',
        cssClass: 'secondary'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async getPersonal() {
    await this.sqlite.getPersonalInfo().then((data) => {
      this.personal = data;
      this.staffid = this.personal[0].staffId;
    }, err => console.error(err));
  }

  async getCourse() {
    await this.sqlite.getTotalCourse().then((data) => {
      this.jumlahhari = data[0].total;
    }, err => console.error(err));
  }

  async getCardColor() {
    await this.sqlite.getColour().then((data) => {
      this.cardcolor = data;
    }, err => console.error(err));
  }

  async getLeave() {
    await this.sqlite.getLeave().then((data) => {
      this.jumlahcuti = data[0].total;
    }, err => console.error(err));
  }


  // get waktu masuk
  async getTimeInandOut() {
    await this.sqlite.getTimeIn().then((data) => {
      this.inout = data;
      const getwaktumasuk = this.inout[0].thisTime;

      if (getwaktumasuk < '09:00:00') {
        this.comeinearly = getwaktumasuk;
      } else {
        this.comeinlate = getwaktumasuk;
      }

      const getwaktumasuk2 = getwaktumasuk;

      const splitzer = getwaktumasuk2.split(':');

      // convert hour (waktu masuk)
      const hour = (+splitzer[0]) * 3600;
      const hours = hour / 3600;
      this.gethour = hours;

      // convert min (waktu masuk)
      const minutes = (+splitzer[1]) * 60;
      const min = minutes / 60;
      this.wmasukmin = min;

      if (this.wmasukmin < 10) {
        this.waktumasuk = '0' + this.wmasukmin;
      } else {
        this.waktumasuk = this.wmasukmin;
      }
      // get waktu tamat bertugas
      this.sqlite.getWaktuKerja().then((data1) => {
        this.workhour = data1;

        const addwaktukerja = '09:00';
        const splitwaktukerja = addwaktukerja.split(':');

        // convert hour (waktu tamat bertugas)
        const seconds = (+splitwaktukerja[0]) * 3600;
        const newhour1 = seconds / 3600;
        const waktukerja = newhour1;
        const wkerjacvt = (waktukerja + hours) + ':' + this.waktumasuk;
        const wkerjahm = wkerjacvt;

        this.newwaktukerjasec = wkerjahm;

      }, err => console.error(err));
    }, err => console.error(err));
  }

  async getWorkHour() {
    await this.sqlite.getWaktuKerja().then((data) => {
      this.whuser = data;
    }, err => console.error(err));
  }

  // get waktu keluar
  async getTimeInandOut2() {
    await this.sqlite.getTimeOut().then((data) => {

      this.inout2 = data;
      const waktukeluar = this.inout2[0].thisTime;
      const getwaktukeluar = waktukeluar;

      if ((getwaktukeluar !== null)) {
        this.wkeluar = waktukeluar;
      } else {
        this.wkeluar = null;
      }
    }, err => console.error(err));
  }
}
