import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponentOptions } from 'ion2-calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  public editForm: FormGroup;
  public Leavedetails = {};
  public leavedetailsdata = {};
  public leaveUser = {};
  public today: Date;
  public mycode = {};
  public descCode = {};
  public selectedLeaveCode = {};
  public days = {};
  public defaultDate = {};
  public JenisCuti = {};

  dateRange: { from: string; to: string; };
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  LeaveCode: any;

  constructor(
    public alertController: AlertController,
    private router: Router,
    private sqlite: SqliteService,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    ) {

      this.getListCuti();
      const id = this.route.snapshot.paramMap.get('id');
      this.sqlite.getDetailsLeave(id).then(res => {
        this.leaveUser = res;
        this.today = new Date(),
        this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
        + '-' + ('0' + new Date().getDate()).slice(-2);
        this.editForm = this.formBuilder.group({
          StaffID: res[0].StaffID,
          StartDate: res[0].StartDate,
          EndDate: res[0].EndDate,
          NoOfDay: res[0].NoOfDay,
          LeaveCode: res[0].LeaveCode,
          Remark: res[0].Remark,
          });
        });
    }

  ngOnInit() {

  }

  async getListCuti() {
    await this.sqlite.getListJenisCuti()
      .then((cuti) => {
        this.JenisCuti = cuti;
      }, err => console.error(err));
  }

  async getLeaveDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sqlite.getDetailsLeave(id)
    .then((data) => {
      this.Leavedetails = data;
      this.sqlite.getLeaveCode(this.leaveUser[0].LeaveCode)
      .then((Codedetails) => {
        this.mycode = Codedetails;
        this.descCode = this.mycode[0].LeaveDesc;
      }, err => console.error(err));
  }, err => console.error(err));

}


async presentAlertConfirm() {
  const alert = await this.alertController.create({
    message: 'Cuti Telah Berjaya Dikemaskini',
    mode: 'ios',
    buttons: [
      {
        text: 'OK',
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

async showAlert() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    subHeader: '',
    message: ' Tarikh Permohonan Mestilah Tidak Kurang Pada Tarikh Yang Di Pohon ',
    mode: 'ios',
    buttons: [{
      text: 'OK',
      handler: () => {
          this.router.navigate(['edit']);
      }
    }]
  });
  await alert.present();
  const result = await alert.onDidDismiss();
  console.log(result);
}


async backAlertConfirm() {
  const alert = await this.alertController.create({
    message: 'Anda Pasti Mahu Kembali? <br> Segala Perubahan Anda Tidak Akan Disimpan',
    mode: 'ios',
    buttons: [
      {
        text: 'YA',
        handler: () => {
          this.router.navigate(['/leave']);
        }
      }, {
        text: 'TIDAK',
        handler: () => {
          this.router.navigate(['/leave/edit']);
        }
      }
    ]
  });

  await alert.present();
  const result = await alert.onDidDismiss();
  console.log(result);
}

  saveForm(){

    const start = +new Date(this.editForm.value.StartDate);
    const elapsed = (+new Date(this.editForm.value.EndDate) - start) / 1000 / 60 / 60 / 24;
    this.days = elapsed + 1;


    if ((this.editForm.value.EndDate >= this.editForm.value.StartDate && this.editForm.value.StartDate <= this.editForm.value.StartDate)

    ||  (this.editForm.value.EndDate >= this.defaultDate && this.editForm.value.StartDate >= this.defaultDate))

    {

    const myLeaveDetails = {
      ealv_startdate: this.editForm.value.StartDate,
      ealv_enddate: this.editForm.value.EndDate,
      ealv_remark: this.editForm.value.Remark,
      ealv_noofdays: this.days,
      ealv_leavecode: this.editForm.value.LeaveCode,

    };
    this.apiService.updateLeaveDetails(myLeaveDetails);
    this.sqlite.updateUserLeave(this.editForm.value);
    this.router.navigate(['/leave/edit']);
    this.presentAlertConfirm();

    } else {

      this.showAlert();
    }
  }

}
