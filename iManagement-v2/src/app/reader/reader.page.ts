import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {

  public statusreader: any;
  public lastupdate: any;

  constructor(
    private getapi: ApiService,
    private sqlite: SqliteService,
    public apiService: ApiService,
    public loadingController: LoadingController,
  ) {
    this.getStatReader();
    this.countTotalKehadiran();
    this.countTotalCourses();
    this.countTotalLeave();
    this.UpdateReaderStatus();
   }

  ngOnInit() {
  }

  async handleButtonClick() {
    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.statusreader = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        setTimeout(async () => {
          await this.sqlite.getStatusReader().then((data) => {
            this.statusreader = data;
            loading.dismiss();
            this.sqlite.getWaktuSemasa().then((data1) => {
              this.lastupdate = data1;
              loading.dismiss();
            }, err => console.error(err));
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 500);
  }

  async UpdateReaderStatus() {
    this.sqlite.getWaktuSemasa().then((data) => {
      this.lastupdate = data;
    }, err => console.error(err));
  }

  async getStatReader() {
    await this.sqlite.getStatusReader().then((data) => {
      this.statusreader = data;
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
