import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';
import { ViewPage } from './view/view.page';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-attendaceapproval',
  templateUrl: './attendaceapproval.page.html',
  styleUrls: ['./attendaceapproval.page.scss'],
})
export class AttendaceapprovalPage implements OnInit {
  public listReason: any;
  public pelulusId = {};

  constructor(
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private sqlite: SqliteService,
    private apiService: ApiService,
    public loadingController: LoadingController,
    public modal: ModalController,
    private sharedservice: SharedService,
  ) {
      this.getListofReason();
      this.getPersonal();
      this.countTotalKehadiran();
      this.countTotalCourses();
      this.countTotalLeave();
    }

  ngOnInit() {
  }

  async handleButtonClick() {
    this.sqlite.dropDb();
    this.sqlite.createDb();
    this.listReason = [];

    setTimeout(() => {
      this.apiService.fetchAllApi().then(async () => {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        setTimeout(async () => {
          await this.sqlite.getListofReasonForApproval().then((data) => {
            this.listReason = data;
            loading.dismiss();
          }, err => console.error(err));
        }, 10000);
      }, err => console.error(err));
    }, 500);
  }

  async countTotalKehadiran() {
    await this.sqlite.getTotalNumberOfKehadiran().then((data) => {
      this.countTotalKehadiran = data[0].total;
    }, err => console.error(err));
  }

  async countTotalCourses() {
    await this.sqlite.getTotalNumberOfCourse().then((data) => {
      this.countTotalCourses = data[0].total;
    }, err => console.error(err));
  }

  async countTotalLeave() {
    await this.sqlite.getTotalNumberOfLeave().then((data) => {
      this.countTotalLeave = data[0].total;
    }, err => console.error(err));
  }

  async getPersonal() {
    await this.sqlite.getPersonalInfo().then((data) => {
      this.pelulusId = data[0].staffId;
    }, err => console.error(err));
  }

  async getListofReason() {
    await this.sqlite.getListofReasonForApproval().then((data) => {
      this.listReason = data;
    }, err => console.error(err));
  }

  async kivAlertConfirm(rowId, staffId, lateDate, lateCode, lateTime, catitan) {
    const dateOb = new Date();
    const date = ('0' + dateOb.getDate()).slice(-2);
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2);
    const year = dateOb.getFullYear();
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format 2021-03-26 10:31:03
    const tarikh = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    const alert = await this.alertController.create({
      // header: 'Notis',
      message: 'Tukar Kelulusan Kursus Ke KIV?',
      mode: 'ios',
      inputs: [
        {
          name: 'catitan',
          label: 'Catitan',
          value: catitan,
          placeholder: 'Catitan',
          type: 'textarea',
        },
      ],
      buttons: [
        {
          text: 'Ya',
          role: 'accept',
          cssClass: 'secondary',
          handler: (dataAt) => {
            if ((dataAt.catitan === undefined) || (dataAt.catitan === '')) {
              dataAt.catitan = 'Sila berikan alasan lanjut';
            }

            const updateApproval = {
              ealt_staffid: staffId,
              ealt_date: lateDate,
              ealt_status: 3,
              ealt_latecode: lateCode,
              ealt_latetime: lateTime,
              ealt_lulusdttime: tarikh,
              ealt_pelulus: this.pelulusId,
              ealt_catit: dataAt.catitan
            };
            this.apiService.pelulusUpdateReasonApproval(updateApproval)
            .then((response) => {
              const updateSqlite = {
                pelulusId: this.pelulusId,
                catitan: dataAt.catitan,
                status: 3,
                id: rowId
              };
              this.sqlite.pelulusUpdateReasonList(updateSqlite);
              this.getListofReason();
              this.sharedservice.change2();
            }, err => console.error(err));
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getListofReason();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async approvedAlertConfirm(rowId, staffId, lateDate, lateCode, lateTime, catitan) {
    const dateOb = new Date();
    const date = ('0' + dateOb.getDate()).slice(-2);
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2);
    const year = dateOb.getFullYear();
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format 2021-03-26 10:31:03
    const tarikh = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    const alert = await this.alertController.create({
      // header: 'Notis',
      message: 'Luluskan Alasan Ini?',
      mode: 'ios',
      inputs: [
        {
          name: 'catitan',
          label: 'Catitan',
          value: catitan,
          placeholder: 'Catitan',
          type: 'textarea',
        },
      ],
      buttons: [
        {
          text: 'Ya',
          role: 'accept',
          cssClass: 'secondary',
          handler: (dataAtt) => {
            if ((dataAtt.catitan === undefined) || (dataAtt.catitan === '')) {
              dataAtt.catitan = 'Sila berikan alasan lanjut';
            }
            console.log('Confirm Okay');
            const updateApproval = {
              ealt_staffid: staffId,
              ealt_date: lateDate,
              ealt_status: 1,
              ealt_latecode: lateCode,
              ealt_latetime: lateTime,
              ealt_lulusdttime: tarikh,
              ealt_pelulus: this.pelulusId,
              ealt_catit: dataAtt.catitan
            };
            this.apiService.pelulusUpdateReasonApproval(updateApproval)
            .then((response) => {
              const updateSqlite = {
                pelulusId: this.pelulusId,
                catitan: dataAtt.catitan,
                status: 1,
                id: rowId
              };
              this.sqlite.pelulusUpdateReasonList(updateSqlite);
              this.getListofReason();
              this.sharedservice.change2();
            }, err => console.error(err));

          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getListofReason();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async canceledAlertConfirm(rowId, staffId, lateDate, lateCode, lateTime, catitan) {
    const dateOb = new Date();
    const date = ('0' + dateOb.getDate()).slice(-2);
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2);
    const year = dateOb.getFullYear();
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format 2021-03-26 10:31:03
    const tarikh = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    const alert = await this.alertController.create({
      // header: 'Notis',
      message: 'Tidak Meluluskan Alasan Ini?',
      mode: 'ios',
      inputs: [
        {
          name: 'catitan',
          label: 'Catitan',
          value: catitan,
          placeholder: 'Catitan',
          type: 'textarea',
        },
      ],
      buttons: [
        {
          text: 'Ya',
          role: 'accept',
          cssClass: 'secondary',
          handler: (dataAttt) => {
            console.log('Confirm Okay');
            if ((dataAttt.catitan === undefined) || (dataAttt.catitan === '')) {
              dataAttt.catitan = 'Sila berikan alasan lanjut';
            }

            const updateApproval = {
              ealt_staffid: staffId,
              ealt_date: lateDate,
              ealt_status: 2,
              ealt_latecode: lateCode,
              ealt_latetime: lateTime,
              ealt_lulusdttime: tarikh,
              ealt_pelulus: this.pelulusId,
              ealt_catit: dataAttt.catitan
            };
            this.apiService.pelulusUpdateReasonApproval(updateApproval)
            .then((response) => {
              const updateSqlite = {
                pelulusId: this.pelulusId,
                catitan: dataAttt.catitan,
                status: 2,
                id: rowId
              };
              this.sqlite.pelulusUpdateReasonList(updateSqlite);
              this.getListofReason();
              this.sharedservice.change2();
            }, err => console.error(err));
          }
        }, {
          text: 'Kembali',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getListofReason();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async Alasan(data) {
    const modalAdd = await this.modal.create({
      component: ViewPage,
      cssClass: 'alasan',
      swipeToClose: true,
      componentProps: {
        data,
      },
      presentingElement: await this.modal.getTop() // Get the top-most ion-modal
    });
    return await modalAdd.present();
  }
}
