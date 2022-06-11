import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {

  public ListCourses: any;
  public Courses = {};
  public loading: any;
  public staffID = {};
  public personal = {};
  public id = {};

  @ViewChild(IonContent, { static: false }) content: IonContent;

  ionViewWillEnter() {
    this.getListCourse();
  }

  constructor(
    public alertController: AlertController,
    private router: Router,
    public apiService: ApiService,
    private sqlite: SqliteService,
    public loadingController: LoadingController,
  ) {
    this.getListCourse();
    this.countTotalKehadiran();
    this.countTotalCourses();
    this.countTotalLeave();
  }

  ngOnInit() {

  }

    async handleButtonClick() {
      this.sqlite.dropDb();
      this.sqlite.createDb();
      this.ListCourses = [];

      setTimeout(() => {
        this.apiService.fetchAllApi().then(async () => {
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
          });
          await loading.present();
          setTimeout(async () => {
            await this.sqlite.getSenaraiTugasLuar().then((data) => {
              this.ListCourses = data;
              loading.dismiss();
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

  async getListCourse() {
    await this.sqlite.getSenaraiTugasLuar().then((data) => {
      this.ListCourses = data;
    }, err => console.error(err));
  }

  async presentAlertConfirm(CourseID, id) {
    const alert = await this.alertController.create({
      message: 'Anda Pasti Untuk Padam Kursus Ini?',
      mode: 'ios',
      buttons: [
        {
          text: 'Ya',
          role: 'accept',
          cssClass: 'secondary',
          handler: () => {
            this.sqlite.deleteCourses(id);
            this.apiService.deleteCourseDetails(CourseID);
            this.getListCourse();
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(['/course']);
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async acceptAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Anda Pasti Untuk Meluluskan Permohonan Kursus Ini?',
      mode: 'ios',
      buttons: [
        {
          text: 'Ya',
          cssClass: 'secondary',
          handler: () => {
            console.log('Deleted');
            this.router.navigate(['/course']);
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Not Deleted');
            this.router.navigate(['/course']);
          }
        }
      ]
    });


    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

}
