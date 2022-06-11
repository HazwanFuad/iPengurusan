import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-editcourse',
  templateUrl: './editcourse.page.html',
  styleUrls: ['./editcourse.page.scss'],
  providers: [Keyboard],
})
export class EditcoursePage implements OnInit {

  public editForm: FormGroup;
  public Coursedetails = {};
  public ListCourses = {};
  public mycode = {};
  public descCode = {};
  public courses = {};
  public today: Date;
  public SelectCodeCourse = {};
  public defaultDate = {};
  public days = {};
  public BilJams = {};
  public start = {};
  public end = {};
  public totaltime = {};
  public JenisTugasLuar = {};
  isKeyboardHide = true;



  constructor(
    public alertController: AlertController,
    private router: Router,
    private sqlite: SqliteService,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public keyboard: Keyboard,
    ) {

     this.getListTugasLuar();
     this.getSenaraiTugas();
     const id = this.route.snapshot.paramMap.get('id');
     this.sqlite.getSenaraiTugasLuarDetails(id).then(res => {
      this.courses = res;
      this.SelectCodeCourse = this.courses[0].KurCode;
      this.today = new Date(),
      this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      + '-' + ('0' + new Date().getDate()).slice(-2);
      this.editForm = this.formBuilder.group({
        CourseID: res[0].CourseID,
        StaffID: res[0].StaffID,
        StaffName: res[0].StaffName,
        CourseName: res[0].CourseName,
        KurLocation: res[0].KurLocation,
        KurMula: res[0].KurMula,
        KurTamat: res[0].KurTamat,
        KurStart: res[0].KurStart,
        KurEnd: res[0].KurEnd,
        KurCode: new FormControl('', Validators.required),
        KurAnjuran: res[0].KurAnjuran,
        kurNoDays: res[0].kurNoDays,
        TimeStart: res[0].TimeStart,
        TimeEnd: res[0].TimeEnd,
        KurApply: res[0].KurApply,
        KurRujukan: res[0].KurRujukan,
        KurMulaHour: res[0].KurMulaHour,
        KurEndHour: res[0].KurEndHour,
        Bil_Jam: res[0].Bil_Jam,
        Status: res[0].Status,
        ApproveBy: res[0].ApproveBy,
        Pelulus: res[0].Pelulus,
        descCode: res[0].descCode,
        });
      });
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
            this.router.navigate(['editcourse']);
        }
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }



  async editCourseActionClick() {
    const alert = await this.alertController.create({
      message: 'Maklumat Kursus Telah Dikemaskini',
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

  ngOnInit() {
  }


    async getSenaraiTugas() {
      const id = this.route.snapshot.paramMap.get('id');
      this.sqlite.getSenaraiTugasLuarDetails(id)
      .then((data) => {
        this.Coursedetails = data;
        this.sqlite.getCodeKursus(this.Coursedetails[0].KurCode)
        .then((Codedetails) => {
          this.mycode = Codedetails;
          this.descCode = this.mycode[0].CoursesDesc;
        }, err => console.error(err));
    }, err => console.error(err));
    }

    async getListTugasLuar() {
      await this.sqlite.getListJenisTugasLuar()
        .then((tugasluar) => {
          this.JenisTugasLuar = tugasluar;
        }, err => console.error(err));
    }


    saveForm(){

      if ((this.editForm.value.KurEnd >= this.editForm.value.KurStart && this.editForm.value.KurEnd >= this.defaultDate)

      ||  (this.editForm.value.KurStart >= this.defaultDate &&  this.editForm.value.KurStart <= this.editForm.value.KurEnd ))

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

        if (this.editForm.value.TimeStart === ''){
          this.start = '00:00:00';
          this.end = '00:00:00';
          this.totaltime = '00:00:00';
        } else {
          this.start = this.editForm.value.TimeStart;
          this.end = this.editForm.value.TimeEnd;
          this.totaltime = this.BilJams;
        }


        const myCourseDetails = {
          eakur_id: this.editForm.value.CourseID,
          eakur_name: this.editForm.value.CourseName,
          eakur_location: this.editForm.value.KurLocation,
          eakur_start: this.editForm.value.KurStart,
          eakur_end: this.editForm.value.KurEnd,
          eakur_outkod: this.editForm.value.KurCode,
          eakur_anjuran: this.editForm.value.KurAnjuran,
          eakur_noday: this.days,
          eakur_timestart: this.editForm.value.TimeStart,
          eakur_timeend: this.editForm.value.TimeEnd,
          eakur_apply: this.editForm.value.KurApply,
          eakur_rujukan: this.editForm.value.KurRujukan,
          eakur_biljam: this.BilJams,
          eakur_status: this.editForm.value.Status,
      };
        this.apiService.UpdateCourses(myCourseDetails);
        this.sqlite.UpdateCourses(myCourseDetails);
        this.router.navigate(['/course/editcourse']);
        this.editCourseActionClick();
    }
    else {

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
            this.router.navigate(['/course']);
          }
        }, {
          text: 'TIDAK',
          handler: () => {
            this.router.navigate(['/course/editcourse']);
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
