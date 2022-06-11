import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
  providers: [Keyboard],
})
export class ConfirmPage implements OnInit {

  public editForm: FormGroup;
  public Coursedetails = {};
  public ListCourses = {};
  public mycode = {};
  public descCode = {};
  public courses = {};
  public SelectCodeCourse = {};
  public defaultDate = {};
  public days = {};
  public startDays = {};
  public  BilDays = {};
  public BilJams = {};
  public newjam = {};
  public newjam1 = {};
  public start = {};
  public end = {};
  public totaltime = {};
  public CourseID = {};
  isKeyboardHide = true;
  public JenisTugasLuar = {};


  constructor(
    private router: Router,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private sqlite: SqliteService,
    public keyboard: Keyboard,
  ) {

      this.getListTugasLuar();
      this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      + '-' + ('0' + new Date().getDate()).slice(-2);
      this.editForm = this.formBuilder.group({
        CourseID: new FormControl(''),
        StaffID: new FormControl(''),
        StaffName: new FormControl(''),
        CourseName: new FormControl(''),
        KurLocation: new FormControl(''),
        KurMula: new FormControl(''),
        KurTamat: new FormControl(''),
        KurStart: new FormControl(''),
        KurEnd: new FormControl(''),
        KurCode: new FormControl('', Validators.required),
        KurAnjuran: new FormControl(''),
        Kehadiran: new FormControl(''),
        Wakil: new FormControl(''),
        Doc: new FormControl(''),
        kurNoDays: new FormControl(''),
        TimeStart: new FormControl(''),
        TimeEnd: new FormControl(''),
        KurApply: new FormControl(''),
        KurRujukan: new FormControl(''),
        KurMulaHour: new FormControl(''),
        KurEndHour: new FormControl(''),
        Bil_Jam: new FormControl(''),
        Status:  0,
        ApproveBy: new FormControl(''),
        Pelulus: new FormControl(''),
        });

  }

  ngOnInit() {
  }

  async getListTugasLuar() {
    await this.sqlite.getListJenisTugasLuar()
      .then((tugasluar) => {
        this.JenisTugasLuar = tugasluar;
      }, err => console.error(err));
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
            this.router.navigate(['confirm']);
        }
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

    saveForm()
    {

      const start = +new Date(this.editForm.value.KurStart);
      const elapsed = (+new Date(this.editForm.value.KurEnd) - start) / 1000 / 60 / 60 / 24;
      this.days = elapsed + 1;

      const TimeStart =  (this.editForm.value.TimeStart);
      const splitjamMula = TimeStart.split(':');
      const hourmula = (+splitjamMula[0]) * 3600;
      const minmula = (+splitjamMula[1]) * 60;
      const newjam = hourmula + minmula;
      const TimeEnd =  (this.editForm.value.TimeEnd);
      const splitjamakhir = TimeEnd.split(':');
      const hourakhir = (+splitjamakhir[0]) * 3600;
      const minakhir = (+splitjamakhir[1]) * 60;
      const newjam1 = hourakhir + minakhir;
      this.BilJams = newjam1 - newjam;

      if ((this.editForm.value.KurEnd >= this.editForm.value.KurStart && this.editForm.value.KurEnd >= this.defaultDate)

      ||  (this.editForm.value.KurStart >= this.defaultDate &&  this.editForm.value.KurStart <= this.editForm.value.KurEnd ))
      {
        if (this.editForm.value.TimeStart === ''){
          this.start = '00:00:00';
          this.end = '00:00:00';
          this.totaltime = '00:00:00';
        } else {
          this.start = this.editForm.value.TimeStart;
          this.end = this.editForm.value.TimeEnd;
          this.totaltime = this.BilJams;
        }
        const myCoursesDetails = {
          eakur_start: this.editForm.value.KurStart,
          eakur_end: this.editForm.value.KurEnd,
          eakur_noday: this.days,
          eakur_outkod: this.editForm.value.KurCode,
          eakur_timestart: this.start,
          eakur_timeend: this.end,
          eakur_apply: this.defaultDate,
          eakur_name: this.editForm.value.CourseName,
          eakur_anjuran: this.editForm.value.KurAnjuran,
          eakur_location: this.editForm.value.KurLocation,
          eakur_kehadir: '',
          eakur_wakil: '',
          eakur_doc: '',
          eakur_rujukan: this.editForm.value.KurRujukan,
          eakur_biljam: this.totaltime,
          status :  this.editForm.value.Status,
        };

        this.apiService.InsertCoursesDetails(myCoursesDetails);
        this.sqlite.InsertCourses(myCoursesDetails);
        this.router.navigate(['/course/confirm']);
        this.confirmCourseActionClick();
      }
        else {

        this.showAlert();

        }
    }

    async confirmCourseActionClick() {
      const alert = await this.alertController.create({
        message: 'Permohonan Berjaya Disimpan',
        mode: 'ios',
        buttons: [
          {
            text: 'OK',
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

    async backAlertConfirm() {
      const alert = await this.alertController.create({
        message: 'Anda Pasti Mahu Kembali? <br> Segala Perubahan Anda Tidak Akan Disimpan',
        mode: 'ios',
        buttons: [
          {
            text: 'YA',
            handler: () => {
              this.router.navigate(['/course']);
            }
          }, {
            text: 'TIDAK',
            handler: () => {
              this.router.navigate(['/course/confirm']);
            }
          }
        ]
      });

      await alert.present();
      const result = await alert.onDidDismiss();
      console.log(result);
    }


    ionViewWillEnter() {
      this.keyboard.onKeyboardWillShow().subscribe(() => {
        this.isKeyboardHide = false;
      });

      this.keyboard.onKeyboardWillHide().subscribe(() => {
        this.isKeyboardHide = true;
      });
    }

}
