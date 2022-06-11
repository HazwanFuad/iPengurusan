import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SqliteService } from '../../services/sqlite.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.page.html',
  styleUrls: ['./approve.page.scss'],
})
export class ApprovePage implements OnInit {
  public listKemasukanAlasan: any;
  public alasan = false;

  ionViewWillEnter() {
    this.getList();
  }

  constructor(
    public alertController: AlertController,
    private router: Router,
    private sqlite: SqliteService,
    private apiService: ApiService,
    public loadingController: LoadingController,
    private sharedservice: SharedService,
  ) {
    this.getList();
    this.countTotalKehadiran();
    this.countTotalCourses();
    this.countTotalLeave();

  }

  ngOnInit() {
    const subscription = this.sharedservice.getEmittedValue()
    .subscribe(item => {
      this.alasan = item;
      if (this.alasan) {
        this.sqlite.dropDb();
        this.sqlite.createDb();

        setTimeout(async () => {
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
          });
          await loading.present();
          this.apiService.fetchAllApi().then(async () => {
            setTimeout(async () => {
              loading.dismiss();
              await this.sqlite.getListKemasukanAlasanLatest().then((data) => {
                this.listKemasukanAlasan = data;
                loading.dismiss();
              }, err => console.error(err));
            }, 15000);
          }, err => console.error(err));
        }, 500);
      }
    });
  }

  async handleButtonClick() {
    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.listKemasukanAlasan = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        setTimeout(async () => {
          loading.dismiss();
          await this.sqlite.getListKemasukanAlasanLatest().then((data) => {
            this.listKemasukanAlasan = data;
            loading.dismiss();
            this.sqlite.getTotalNumberOfKehadiran().then((data1) => {
              this.countTotalKehadiran = data1[0].total;
              loading.dismiss();
            }, err => console.error(err));
          }, err => console.error(err));
        }, 15000);
      }, err => console.error(err));
    }, 500);
  }

  async getList() {
    await this.sqlite.getListKemasukanAlasanLatest().then((data) => {
      this.listKemasukanAlasan = data;
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

}
