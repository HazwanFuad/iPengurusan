import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ApiService } from 'src/app/services/api.service';
// [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  public reasonById = {};
  public pelulusId = {};
  public data: any;
  constructor(
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private route: ActivatedRoute,
    private sqlite: SqliteService,
    private apiService: ApiService,

  ) {
      this.getPersonal();

    }

  ngOnInit() {
    this.getReasonbyId(this.data);
  }

  async getPersonal() {
    await this.sqlite.getPersonalInfo().then((data) => {
      this.pelulusId = data[0].staffId;
    }, err => console.error(err));
  }
  async getReasonbyId(id){
    this.sqlite.getListReasonForApprovalbyId(id)
    .then((data) => {
      this.reasonById = data[0];
    }, err => console.error(err));
  }

  async handleActionClick(rowId, staffId, lateDate, lateCode, lateTime, catitanInsert) {
    const dateOb = new Date();
    const date = ('0' + dateOb.getDate()).slice(-2);
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2);
    const year = dateOb.getFullYear();
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format 2021-03-26 10:31:03
    const tarikh = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    const actionSheet = await this.actionSheetController.create({
      header: 'Sahkan Kelulusan Alasan?',
      mode: 'ios',
      buttons: [
        // { text: 'Deconste', role: 'destructive' },
        {
          text: 'Ya',
          handler: () => {
              const updateApproval = {
                ealt_staffid: staffId,
                ealt_date: lateDate,
                ealt_status: 1,
                ealt_latecode: lateCode,
                ealt_latetime: lateTime,
                ealt_lulusdttime: tarikh,
                ealt_pelulus: this.pelulusId,
                ealt_catit: catitanInsert
              };
              this.apiService.pelulusUpdateReasonApproval(updateApproval)
              .then((response) => {
                const updateSqlite = {
                  pelulusId: this.pelulusId,
                  catitan: catitanInsert,
                  status: 1,
                  id: rowId
                };
                this.sqlite.pelulusUpdateReasonList(updateSqlite);
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                  this.router.navigate(['/userdashboard'])
                );
              }, err => console.error(err));
          }
        },
        {
          text: 'Tidak',
          role: 'destructive',
          handler: () => {
            const updateApproval = {
              ealt_staffid: staffId,
              ealt_date: lateDate,
              ealt_status: 2,
              ealt_latecode: lateCode,
              ealt_latetime: lateTime,
              ealt_lulusdttime: tarikh,
              ealt_pelulus: this.pelulusId,
              ealt_catit: catitanInsert
            };
            this.apiService.pelulusUpdateReasonApproval(updateApproval)
            .then((response) => {
              const updateSqlite = {
                pelulusId: this.pelulusId,
                catitan: catitanInsert,
                status: 2,
                id: rowId
              };
              this.sqlite.pelulusUpdateReasonList(updateSqlite);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/userdashboard'])
            );
            }, err => console.error(err));
          }
        },
        {
          text: 'KIV',
          role: 'destructive',
          handler: () => {
            if ((catitanInsert === undefined) || (catitanInsert === '')) {
              catitanInsert = 'Sila berikan alasan lanjut';
            }

            const updateApproval = {
              ealt_staffid: staffId,
              ealt_date: lateDate,
              ealt_status: 3,
              ealt_latecode: lateCode,
              ealt_latetime: lateTime,
              ealt_lulusdttime: tarikh,
              ealt_pelulus: this.pelulusId,
              ealt_catit: catitanInsert
            };
            this.apiService.pelulusUpdateReasonApproval(updateApproval)
            .then((response) => {
              const updateSqlite = {
                pelulusId: this.pelulusId,
                catitan: catitanInsert,
                status: 3,
                id: rowId
              };
              this.sqlite.pelulusUpdateReasonList(updateSqlite);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/userdashboard'])
            );
            }, err => console.error(err));
          }
        },
        {
          text: 'Kembali',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
}
