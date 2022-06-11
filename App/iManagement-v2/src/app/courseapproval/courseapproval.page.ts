import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController} from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';
import { DetailsPage } from './details/details.page';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-courseapproval',
  templateUrl: './courseapproval.page.html',
  styleUrls: ['./courseapproval.page.scss'],
})
export class CourseapprovalPage implements OnInit {

  public CoursesUser: any;
  public defaultDate: any;
  public ApproveID = {};

  constructor(
    public alertController: AlertController,
    private router: Router,
    public apiService: ApiService,
    private sqlite: SqliteService,
    public loadingController: LoadingController,
    public modal: ModalController,
    private sharedservice: SharedService,
  ) {
    this.GetLulusTugas();
    this.countTotalKehadiran();
    this.countTotalCourses();
    this.countTotalLeave();
    }

  ngOnInit() {
  }

  async handleButtonClick() {
    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.CoursesUser = [];
    this.defaultDate = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        setTimeout(async () => {
          await this.sqlite.getTugasLuar().then((data) => {
            this.CoursesUser = data;
            this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
            + '-' + ('0' + new Date().getDate()).slice(-2);
            loading.dismiss();
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 500);
  }

  async GetLulusTugas() {
    await this.sqlite.getTugasLuar().then((data) => {
      this.CoursesUser = data;
      this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      + '-' + ('0' + new Date().getDate()).slice(-2);
    }, err => console.error(err));
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

    async acceptAlertConfirm(CourseID, KurApproveBy, HourCourses) {
    const alert = await this.alertController.create({
      message: 'Anda Pasti Untuk Meluluskan Permohonan Kursus Ini?',
      mode: 'ios',
      buttons: [
        {
          text: 'Ya',
          cssClass: 'secondary',
          handler: () => {
            const Kelulusan = {
              eakur_appdate: this.defaultDate,
              eakur_approveby: KurApproveBy,
              eakur_status: 1,
              eaal_hour: HourCourses,
              eakur_id: CourseID,
            };
            this.apiService.updateLulusTugasLuar(Kelulusan);
            this.sqlite.StatusLulusTugas(Kelulusan);
            this.GetLulusTugas();
            this.sharedservice.change2();
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            this.GetLulusTugas();
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }

  async cancelAlertConfirm(CourseID, KurApproveBy, KurApproveDate, HourCourses) {
    const alert = await this.alertController.create({
      message: 'Anda Pasti Untuk Membatalkan Permohonan Kursus Ini?',
      mode: 'ios',
      buttons: [
        {
          text: 'Ya',
          cssClass: 'secondary',
          handler: () => {
            const Kelulusan = {
              eakur_appdate: KurApproveDate,
              eakur_approveby: KurApproveBy,
              eakur_status: 2,
              eaal_hour: HourCourses,
              eakur_id: CourseID,
            };
            this.apiService.updateLulusTugasLuar(Kelulusan);
            this.sqlite.StatusLulusTugas(Kelulusan);
            this.GetLulusTugas();
            this.sharedservice.change2();
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.GetLulusTugas();
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }

  async Tugas(data) {
    const modalAdd = await this.modal.create({
      component: DetailsPage,
      cssClass: 'tugas',
      swipeToClose: true,
      componentProps: {
        data,
      },
      presentingElement: await this.modal.getTop() // Get the top-most ion-modal
    });
    return await modalAdd.present();
  }

}
