import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';


@Component({
  selector: 'app-leave',
  templateUrl: './leave.page.html',
  styleUrls: ['./leave.page.scss'],
})
export class LeavePage implements OnInit {
  [x: string]: any;

  public leaveUser: any;
  public leaveCode: any;
  public mycode: any;
  public descCode: any;
  public myLeaveDetails = {};

  ionViewWillEnter() {
    this.getListleave();
  }

  constructor(
    public alertController: AlertController,
    private router: Router,
    public apiService: ApiService,
    private sqlite: SqliteService,
    public loadingController: LoadingController,
  ) {
      this.getListleave();
      this.countTotalKehadiran();
      this.countTotalCourses();
      this.countTotalLeave();
    }

  ngOnInit() {

  }

  async handleButtonClick() {
    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.leaveUser = [];
    this.mycode = [];
    this.descCode = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        setTimeout(async () => {
          await this.sqlite.getLeaveDetails().then((data) => {
            this.leaveUser = data;
            loading.dismiss();
            this.sqlite.getLeaveCode(this.leaveUser[0].LeaveCode)
            .then((Codedetails) => {
              this.mycode = Codedetails;
              this.descCode = this.mycode[0].LeaveDesc;
              loading.dismiss();
            }, err => console.error(err));
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 500);
  }

  async countTotalKehadiran() {
    this.sqlite.getTotalNumberOfKehadiran().then((data) => {
      this.countTotalKehadiran = data[0].total;
    }, err => console.error(err));
  }

  async countTotalCourses() {
    this.sqlite.getTotalNumberOfCourse().then((data) => {
      this.countTotalCourses = data[0].total;
    }, err => console.error(err));
  }

  async countTotalLeave() {
    this.sqlite.getTotalNumberOfLeave().then((data) => {
      this.countTotalLeave = data[0].total;
    }, err => console.error(err));
  }

  async getListleave() {
    await this.sqlite.getLeaveDetails().then((data) => {
      this.leaveUser = data;
      this.sqlite.getLeaveCode(this.leaveUser[0].LeaveCode)
      .then((Codedetails) => {
        this.mycode = Codedetails;
        this.descCode = this.mycode[0].LeaveDesc;
      }, err => console.error(err));
    }, err => console.error(err));
  }

      async presentAlertConfirm(id, startDate) {
        const alert = await this.alertController.create({
          message: 'Anda Pasti Untuk Hapus Permohonan Cuti Ini?',
          mode: 'ios',
          buttons: [
            {
              text: 'YA',
              cssClass: 'secondary',
              handler: () => {
                this.sqlite.deleteLeave(id);
                this.apiService.deleteLeaveDetails(startDate);
                this.getListleave();
              }
            }, {
              text: 'KEMBALI',
              handler: () => {
                this.router.navigate(['/leave']);
              }
            }
          ]
        });

        await alert.present();
        const result = await alert.onDidDismiss();
        console.log(result);
    }
}
