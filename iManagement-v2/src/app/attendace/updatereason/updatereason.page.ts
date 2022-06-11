import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-updatereason',
  templateUrl: './updatereason.page.html',
  styleUrls: ['./updatereason.page.scss'],
})
export class UpdatereasonPage implements OnInit {
  public editForm: FormGroup;
  public attendace = {};
  public alasanRing = {};
  public alasanType = {};
  public descAlasan = {};
  public Coursedetails = {};
  public ListCourses = {};
  public descCode = {};
  public CodeCourse = {} ;
  public AlasanKehadiran = {} ;
  public typeAlasan = {} ;
  public AlasID = {} ;
  public AlasRing = {};
  public personal  = {};
  public StaffID = {};
  public PelulusID = {};
  public mycode = {};
  public defaultDate = {};
  public AlasJenis = {};
  public AlasCatatan = {};
  public days = {};
  public alasanId = {};
  public ListJenisTugasLuar = {};
  public KehadiranLewat = {};
  public KehadiranTakCukupJam = {};
  public KehadiranTakHadir = {};
  public KehadiranTakLengkap = {};



  constructor(
    public alertController: AlertController,
    private router: Router,
    private sqlite: SqliteService,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sharedservice: SharedService,
    ) {

      this.getSenaraiTugas();
      this.getAlasan();
      this.getPersonal();
      this.getAlasanType();
      this.getJenisTugasLuar();
      this.getListAlasanLewat();
      this.getListAlasanTakCukupJam();
      this.getListAlasanTakHadir();
      this.getListAlasanTakLengkap();




      const id = this.route.snapshot.paramMap.get('id');
      this.sqlite.getListKemasukanAlasanLatestByID(id).then(res => {
      this.attendace = res;
      this.defaultDate =  new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      + '-' + ('0' + new Date().getDate()).slice(-2);
      this.editForm = this.formBuilder.group({
        date: res[0].date,
        masuk: res[0].masuk,
        keluar: res[0].keluar,
        jenis_kehadiran: res[0].jenis_kehadiran,
        alasan_ring: res[0].jenis_kehadiran_desc,
        alasanId: new FormControl(''),
        alasanCatatan: new FormControl(''),
        jenis_kehadiran_desc: res[0].jenis_kehadiran_desc,
        jamkerja: res[0].jamkerja,
        ealt_remark: new FormControl(''),
        Endate: new FormControl(''),
        KurCode: new FormControl(''),
        id: res[0].id,

        });
      });
  }




  ngOnInit() {
  }


  async getSenaraiTugas() {
    this.sqlite.getSenaraiTugasLuar()
    .then((data) => {
      this.Coursedetails = data;
      this.sqlite.getCodeKursus(this.Coursedetails[0].KurCode)
      .then((Codedetails) => {
        this.mycode = Codedetails;
        this.CodeCourse = this.mycode[0].CoursesCode;
        this.descCode = this.mycode[0].CoursesDesc;
      }, err => console.error(err));
  }, err => console.error(err));
  }

  async getAlasan() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sqlite.getListKemasukanAlasanLatestByID(id)
    .then((data) => {
      this.alasanType = data;
      this.sqlite.getCode(this.alasanType[0].alasan_ring)
      .then((AlasanKehadiran) => {
        this.mycode = AlasanKehadiran;
        this.AlasID = this.mycode[0].alasanId;
        this.AlasRing = this.mycode[0].alasanRing;
      }, err => console.error(err));
  }, err => console.error(err));
  }



  async getAlasanType() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sqlite.getListKemasukanAlasanLatestByID(id)
    .then((data) => {
      this.alasanType = data;
      this.sqlite.getReasonKehadiran(this.alasanType[0].alasan_ring)
      .then((AlasanKehadiran) => {
        this.mycode = AlasanKehadiran;
        this.alasanId = this.mycode[0].alasanId;
        this.AlasJenis = this.mycode[0]. alasanJenis;
        this.AlasCatatan = this.mycode[0]. alasanCatatan;
      }, err => console.error(err));
  }, err => console.error(err));
  }

  async getPersonal() {
    await this.sqlite.getPersonalInfo().then((data) => {
      this.personal = data;
      this.StaffID = this.personal[0].staffId;
      this.PelulusID = this.personal[0].pelulusID;
    }, err => console.error(err));
  }

  async getJenisTugasLuar() {
    await this.sqlite.getListJenisTugasLuar()
      .then((ListTL) => {
        this.ListJenisTugasLuar = ListTL;
      }, err => console.error(err));
  }

  async getListAlasanLewat() {
    await this.sqlite.getSenaraiAlasanByLewat()
      .then((lewat) => {
        this.KehadiranLewat = lewat;
      }, err => console.error(err));
  }

  async getListAlasanTakCukupJam() {
    await this.sqlite.getSenaraiAlasanByTakCukupJam()
      .then((xcukupjam) => {
        this.KehadiranTakCukupJam = xcukupjam;
      }, err => console.error(err));
  }

  async getListAlasanTakHadir() {
    await this.sqlite.getSenaraiAlasanByTakHadir()
      .then((xhadir) => {
        this.KehadiranTakHadir = xhadir;
      }, err => console.error(err));
  }

  async getListAlasanTakLengkap() {
    await this.sqlite.getSenaraiAlasanByTakLengkap()
      .then((xlgkp) => {
        this.KehadiranTakLengkap = xlgkp;
      }, err => console.error(err));
  }

  async reasonconfirmActionClick() {
    const alert = await this.alertController.create({
      // header: 'Notis',
      message: 'Alasan Telah Disimpan',
      mode: 'ios',
      buttons: [
        {
          text: 'OK',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(['/attendace/approve']);
            this.sharedservice.change();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  saveForm()
    {


      const start = +new Date(this.editForm.value.date);
      const elapsed = (+new Date(this.editForm.value.Endate) - start) / 1000 / 60 / 60 / 24;
      this.days = elapsed + 1;

      if (this.editForm.value.alasanId === '30' ||  this.editForm.value.alasanId === '106'
      ||  this.editForm.value.alasanId === '39'   ||  this.editForm.value.alasanId === '12' )
      {

      const myCoursesDetails = {
        eakur_start: this.editForm.value.date,
        eakur_end: this.editForm.value.Endate,
        eakur_noday:   this.days,
        eakur_outkod: this.editForm.value.KurCode,
        eakur_timestart: '00:00:00',
        eakur_timeend: '00:00:00',
        eakur_apply: this.defaultDate,
        eakur_name: this.editForm.value.ealt_remark,
        eakur_anjuran:  ' ',
        eakur_location: ' ',
        eakur_kehadir: '',
        eakur_wakil: '',
        eakur_doc: '',
        eakur_rujukan: '',
        eakur_biljam: 0,
        id: this.editForm.value.id
      };
      this.apiService.InsertCoursesDetails(myCoursesDetails);
      this.reasonconfirmActionClick();

      } else {

        const KemasukanAlasan = {

          ealt_staffid: this.StaffID,
          ealt_date: this.editForm.value.date,
          ealt_latecode: this.editForm.value.jenis_kehadiran,
          ealt_latetime: '00:00:00',
          ealt_remark: this.editForm.value.alasanCatatan + ' - ' + this.editForm.value.ealt_remark,
          ealt_timeout: '00:00:00',
          ealt_timein: '00:00:00',
          ealt_jamkerja: '00:00:00',
          id: this.editForm.value.id
        };
        this.apiService.InsertAddAlasan(KemasukanAlasan);
        this.reasonconfirmActionClick();

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
            this.router.navigate(['/attendace/approve']);
          }
        }, {
          text: 'TIDAK',
          handler: () => {
            this.router.navigate(['/attendace/updatereason']);
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
}

