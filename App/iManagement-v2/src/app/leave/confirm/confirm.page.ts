import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  public editForm: FormGroup;
  public Leavedetails = {};
  public leavedetailsdata = {};
  public leaveUser = {};
  public today: Date;
  public days =  {};
  public defaultDate = {};
  public UserDetails = {};
  public staffid = {};
  public JenisCuti = {};

  constructor(

    public alertController: AlertController,
    private router: Router,
    private sqlite: SqliteService,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {

      this.getPersonal();
      this.getListCuti();
      this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      + '-' + ('0' + new Date().getDate()).slice(-2);
      this.editForm = this.formBuilder.group({
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
      LeaveCode: new FormControl('', Validators.required),
      Remark: new FormControl(''),

    });
  }


  ngOnInit() {
  }

  async showAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: '',
      message: ' Tarikh Cuti Mestilah Tidak Kurang Pada Tarikh Yang Di Pohon',
      mode: 'ios',
      buttons: [{
        text: 'OK',
        handler: () => {
            this.router.navigate(['confirm']);
        }
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async getPersonal() {
    this.sqlite.getPersonalInfo().then((data) => {
     this.UserDetails = data;
     this.staffid = this.UserDetails[0].staffId;
   }, err => console.error(err));
 }

 async getListCuti() {
  await this.sqlite.getListJenisCuti()
    .then((cuti) => {
      this.JenisCuti = cuti;
    }, err => console.error(err));
  }


  async leaveApplyAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Cuti Anda Telah Disimpan.',
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

  saveForm() {

    const start = +new Date(this.editForm.value.StartDate);
    const elapsed = (+new Date(this.editForm.value.EndDate) - start) / 1000 / 60 / 60 / 24;
    this.days = elapsed + 1;

    if ((this.editForm.value.EndDate >= this.editForm.value.StartDate && this.editForm.value.EndDate >= this.defaultDate)

      ||  (this.editForm.value.StartDate >= this.defaultDate &&  this.editForm.value.StartDate <= this.editForm.value.EndDate ))

      {

        const myLeaveDetails = {
          ealv_staffid: this.staffid,
          ealv_startdate: this.editForm.value.StartDate,
          ealv_enddate: this.editForm.value.EndDate,
          ealv_remark: this.editForm.value.Remark,
          ealv_noofdays: this.days,
          ealv_leavecode: this.editForm.value.LeaveCode,
        };

        this.apiService.InsertLeaveDetails(myLeaveDetails);
        this.sqlite.insertmyapplication(myLeaveDetails);
        this.router.navigate(['/leave/confirm']);
        this.leaveApplyAlertConfirm();

      } else {
        this.showAlert();
        }
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
            this.router.navigate(['/leave/confirm']);
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

}
