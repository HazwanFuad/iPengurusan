import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorageService } from './native-storage.service';
import { SqliteService } from './sqlite.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  [x: string]: any;

  public token = '';
  public apiUrl = 'http://109.167.100.174/imanagement/';
  public leavedataapi = {};

  constructor(
    private http: HttpClient,
    private nativestorage: NativeStorageService,
    private sqlite: SqliteService,
    private toastCtrl: ToastController,

  ) {}

  private getApiKey(): Promise < string > {
    return this.nativestorage.getToken();
  }

  async refreshApiDashboard() {
    await this.getApiKey().then((data: string) => this.token = data);
    this.getWaktuMasukKeluar();
    this.getTotalLeave();
    this.getTotalCourse();
    this.getListKemasukanAlasan();
  }

  async fetchApiDashboard() {
    await this.getApiKey().then((data: string) => this.token = data);
    this.getWaktuKerja();
    this.getPersonal();
    this.getCardColor();
    this.getTotalLeave();
    this.getTotalCourse();
    this.getListKemasukanAlasan();
    this.PelulusGetListReasonForApproval();
    this.getTugasLuar();
  }

  async fetchOtherApi() {
    await this.getApiKey().then((data: string) => this.token = data);
    this.getReaderType();
    this.getData();
    this.getLeaveCode();
    this.getSenaraiCourse();
    this.getTypeKodCourse();
    this.getTypeAlasanKehadiran();
    this.getCodeReason();
  }

  async fetchAllApi() {
    await this.getApiKey().then((data: string) => this.token = data);
    this.getWaktuKerja();
    this.getPersonal();
    this.getCardColor();
    this.getTotalLeave();
    this.getTotalCourse();
    this.getListKemasukanAlasan();
    this.PelulusGetListReasonForApproval();
    this.getTugasLuar();
    this.getReaderType();
    this.getData();
    this.getLeaveCode();
    this.getSenaraiCourse();
    this.getTypeKodCourse();
    this.getTypeAlasanKehadiran();
    this.getCodeReason();
  }


  async getData() {
    await this.getApiKey().then((data: string) => this.token = data);
    this.http.get(this.apiUrl + 'user_view_leave?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveLeave(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getLeaveCode() {
    this.http.get(this.apiUrl + 'kod_cuti?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveLeaveCode(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getTypeAlasanKehadiran() {
    this.http.get(this.apiUrl + 'type_of_reason?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.SaveReasonKehadiran(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getTugasLuar() {
    this.http.get(this.apiUrl + 'lulus_tugas_luar?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveLulusTugas(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getSenaraiCourse() {
    this.http.get(this.apiUrl + 'total_course?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveSenaraiTugas(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getTypeKodCourse() {
    this.http.get(this.apiUrl + 'jenis_tugas_luar?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveCodeTugasLuar(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async getListKemasukanAlasan() {
    this.http.get(this.apiUrl + 'list_attendance?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveListAttendance(data);
          this.http.get(this.apiUrl + 'problem_attendance_with_reason?access_token=' + this.token, httpOptions)
            .subscribe((dataA: any) => {
                this.sqlite.saveListAttendanceWithReason(dataA);
                this.http.get(this.apiUrl + 'problem_attendance_with_reason?access_token=' + this.token, httpOptions)
                  .subscribe((dataE: any) => {
                      this.sqlite.saveListAttendanceWithReasonStatusKIV(dataE);
                      this.http.get(this.apiUrl + 'public_holiday?access_token=' + this.token, httpOptions)
                        .subscribe((dataB: any) => {
                            this.sqlite.savePublicHoliday(dataB);
                            // cuti
                            this.http.get(this.apiUrl + 'user_view_leave?access_token=' + this.token, httpOptions)
                              .subscribe((dataC: any) => {
                                  this.sqlite.saveCuti(dataC);
                                  this.http.get(this.apiUrl + 'modul_tugas_luar?access_token=' + this.token, httpOptions)
                                    .subscribe((dataD: any) => {
                                        this.sqlite.saveModulTugasLuar(dataD);
                                        this.insertListKIV();
                                        this.insertListAttendanceTIDAKHADIR();
                                        this.insertListAttendanceTIDAKLENGKAP();
                                        this.insertListAttendanceTIDAKCUKUPJAM();
                                        this.insertListAttendanceHADIRLEWAT();
                                        this.insertListAttendanceKELUARAWAL();
                                      },
                                      error => console.log('oops error saveModulTugasLuar', JSON.stringify(error)));
                                },
                                error => console.log('oops error save cuti', JSON.stringify(error)));
                          },
                          error => console.log('oops savePublicHoliday error', JSON.stringify(error)));
                    },
                    error => console.log('oops error saveListAttendanceWithReasonStatusKIV', JSON.stringify(error)));
              },
              error => console.log('oops saveListAttendanceWithReason error', JSON.stringify(error)));
        },
        error => console.log('oops saveListAttendance error', JSON.stringify(error)));
  }

  // START CODE FOR KEMASUKAN ALASAN. PLEASE DO NOT SPLIT THE CODE.
  async insertListKIV() {
    // masukkan senarai yang berstatus KIV
    this.sqlite.getAttendanceLateWithKIV().then((dataLateKIV) => {
      this.sqlite.saveKemasukanAlasanKIV(dataLateKIV);
    }, err => console.error(err));
  }

  async insertListAttendanceTIDAKHADIR() {
    const totalDaysFromAttendance = [];
    await this.sqlite.getListKemasukanAlasanTH().then((data) => {
      // data A -> rekod kedatangan dari sqlite
      this.listKemasukanAlasan = data;
      // dapatkan start date dan end date untuk cari data B
      const startDateArr = new Array();
      const endDateArr = new Array();
      for (let i = 0; i <= Object.keys(this.listKemasukanAlasan).length; i++) {
        const startDate = this.listKemasukanAlasan[0].date;
        // const endDate = this.listKemasukanAlasan[i].date;
        // set end date to today
        const today = new Date();
        const todayA = today.toLocaleString('fr-BE');
        const splittodayA = todayA.split('/');

        const splitYear = splittodayA[2].substring(0, 4);
        let splitMonth = splittodayA[1];
        let splitDay = splittodayA[0];
        if (splitMonth.length === 1) {
          splitMonth = '0' + splitMonth;
        }
        if (splitDay.length === 1) {
          splitDay = '0' + splitDay;
        }
        const dateToday = splitYear + '-' + splitMonth + '-' + splitDay;
        const endDate = dateToday;
        totalDaysFromAttendance.push(JSON.stringify(this.listKemasukanAlasan[i].date));

        if ((i + 1) === (Object.keys(this.listKemasukanAlasan).length)) {
          const endDates = endDate;
          startDateArr.push(startDate);
          endDateArr.push(endDates);
          this.getTotalDaysBetweenTwoDates(startDateArr, endDateArr, totalDaysFromAttendance);
        }
      }
    }, err => console.error(err));
  }

  async getTotalDaysBetweenTwoDates(sd, ed, totalDaysFromAttendance) {
    const totalDaysBetweenTwoDates = [];
    for (const d = new Date(sd); d <= new Date(ed); d.setDate(d.getDate() + 1)) {
      const myDate = new Date(d);
      const A = myDate.toLocaleString('fr-BE');
      const asplit = A.split('/');
      const yeara = asplit[2].substring(0, 4);
      let montha = asplit[1];
      let daya = asplit[0];
      if (montha.length === 1) {
        montha = '0' + montha;
      }
      if (daya.length === 1) {
        daya = '0' + daya;
      }
      const date = '"' + yeara + '-' + montha + '-' + daya + '"';
      totalDaysBetweenTwoDates.push(date);
    }
    const daysNotInAttendanceList = totalDaysBetweenTwoDates.filter(x => !totalDaysFromAttendance.includes(x));

    for (let i = daysNotInAttendanceList.length - 1; i >= 0; i--) {
      const today = new Date(daysNotInAttendanceList[i]);
      today.setMonth(today.getMonth());
      if (today.getDay() === 6 || today.getDay() === 0) {
        daysNotInAttendanceList.splice(i, 1);
      }
    }
    this.getListFromAttendanceReason(daysNotInAttendanceList);
  }

  async getListFromAttendanceReason(daysNotInAttendanceList) {
    const listAttendanceReasons = [];
    this.sqlite.getListAttendanceReasonAll().then((data) => {
      this.listAttendanceReason = data;

      for (let i = 0; i <= Object.keys(this.listAttendanceReason).length; i++) {
        listAttendanceReasons.push(JSON.stringify(this.listAttendanceReason[i].date));

        if ((i + 1) === (Object.keys(this.listAttendanceReason).length)) {
          const diff = daysNotInAttendanceList.filter(x => !listAttendanceReasons.includes(x));
          this.getListCuti(diff);
        }
      }
    }, err => console.error(err));
  }

  async getListCuti(diff) {
    const listCutis = [];
    this.sqlite.getListCuti().then((data) => {
      this.listCuti = data;
      for (let i = 0; i <= Object.keys(this.listCuti).length; i++) {
        listCutis.push(JSON.stringify(this.listCuti[i].date));
        if ((i + 1) === (Object.keys(this.listCuti).length)) {
          const diffs = diff.filter(x => !listCutis.includes(x));
          this.getListPublicHoliday(diffs);
        }
      }
    }, err => console.error(err));
  }

  async getListPublicHoliday(diffs) {
    const listCutisPH = [];
    this.sqlite.getPH().then((data) => {
      this.listCutiPH = data;
      for (let i = 0; i <= Object.keys(this.listCutiPH).length; i++) {
        listCutisPH.push(JSON.stringify(this.listCutiPH[i].date));
        if ((i + 1) === (Object.keys(this.listCutiPH).length)) {
          const diffPH = diffs.filter(x => !listCutisPH.includes(x));
          // this.sqlite.saveKemasukanAlasan(diffPH)
          this.getListModulLuar(diffPH);

        }
      }
    }, err => console.error(err));
  }

  async getListModulLuar(diffPH) {
    const listModulLuar = [];
    this.sqlite.getModulLuar().then((data) => {
      this.listModulLuarData = data;
      for (let i = 0; i <= Object.keys(this.listModulLuarData).length; i++) {
        listModulLuar.push(JSON.stringify(this.listModulLuarData[i].date));
        if ((i + 1) === (Object.keys(this.listModulLuarData).length)) {
          const diffML = diffPH.filter(x => !listModulLuar.includes(x));
          this.sqlite.saveKemasukanAlasan(diffML);
        }
      }
    }, err => console.error(err));
  }

  async insertListAttendanceTIDAKLENGKAP() {
    const totalDaysFromAttendance = [];
    await this.sqlite.getListKemasukanAlasanTL().then((data) => {
      this.listKemasukanAlasanTL = data;
      for (let i = 0; i <= Object.keys(this.listKemasukanAlasanTL).length; i++) {
        totalDaysFromAttendance.push(JSON.stringify(this.listKemasukanAlasanTL[i].date));
        if ((i + 1) === (Object.keys(this.listKemasukanAlasanTL).length)) {
          this.getListFromAttendanceReason2(totalDaysFromAttendance);
        }
      }
    }, err => console.error(err));
  }

  async getListFromAttendanceReason2(totalDaysFromAttendance) {
    const listAttendanceReasons = [];
    await this.sqlite.getListAttendanceReasonAll().then((data) => {
      this.listAttendanceReason = data;
      for (let i = 0; i <= Object.keys(this.listAttendanceReason).length; i++) {
        listAttendanceReasons.push(JSON.stringify(this.listAttendanceReason[i].date));
        if ((i + 1) === (Object.keys(this.listAttendanceReason).length)) {
          const diff = totalDaysFromAttendance.filter(x => !listAttendanceReasons.includes(x));
          this.getListCuti2(diff);
        }
      }
    }, err => console.error(err));
  }

  async getListCuti2(diff) {
    const listCutis = [];
    this.sqlite.getListCuti().then((data) => {
      this.listCuti = data;
      for (let i = 0; i <= Object.keys(this.listCuti).length; i++) {
        listCutis.push(JSON.stringify(this.listCuti[i].date));
        if ((i + 1) === (Object.keys(this.listCuti).length)) {
          const diffs = diff.filter(x => !listCutis.includes(x));
          this.getListModulLua2(diffs);
        }
      }
    }, err => console.error(err));
  }

  async getListModulLua2(diffs) {
    const listModulLuar = [];
    this.sqlite.getModulLuar().then((data) => {
      this.listModulLuarData = data;
      for (let i = 0; i <= Object.keys(this.listModulLuarData).length; i++) {
        listModulLuar.push(JSON.stringify(this.listModulLuarData[i].date));
        if ((i + 1) === (Object.keys(this.listModulLuarData).length)) {
          const diffML = diffs.filter(x => !listModulLuar.includes(x));
          this.getDayMinusWeekend(diffML);
        }
      }
    }, err => console.error(err));
  }

  // tolak weekend
  async getDayMinusWeekend(diffML) {
    const dayMinusWeekend = [];
    for (let i = diffML.length - 1; i >= 0; i--) {
      const today = new Date(diffML[i]);
      today.setMonth(today.getMonth());
      if (today.getDay() === 6 || today.getDay() === 0) {
        diffML.splice(i, 1);
        dayMinusWeekend.push(diffML);
      }
    }

    if (dayMinusWeekend.length === 0) {
      this.sqlite.getTimeInTimeOut(diffML).then((dataA) => {
        this.sqlite.saveKemasukanAlasanTL(dataA);
      }, err => console.error(err));
    } else {
      this.sqlite.getTimeInTimeOut(dayMinusWeekend).then((dataA) => {
        this.sqlite.saveKemasukanAlasanTL(dataA);
      }, err => console.error(err));
    }
  }

  async insertListAttendanceTIDAKCUKUPJAM() {
    const xCukupJamArr = [];
    await this.sqlite.getListTakCukupJam().then((data) => {
      this.listxcukupjam = data;
      for (let i = 0; i <= Object.keys(this.listxcukupjam).length; i++) {
        xCukupJamArr.push(JSON.stringify(this.listxcukupjam[i].date));
        if ((i + 1) === (Object.keys(this.listxcukupjam).length)) {
          this.getListML3(xCukupJamArr);
        }
      }
    }, err => console.error(err));
  }

  async getListML3(xCukupJamArr) {
    const listModulLuar = [];
    this.sqlite.getModulLuar().then((data) => {
      this.listModulLuarData = data;
      for (let i = 0; i <= Object.keys(this.listModulLuarData).length; i++) {
        listModulLuar.push(JSON.stringify(this.listModulLuarData[i].date));
        if ((i + 1) === (Object.keys(this.listModulLuarData).length)) {
          const diffML = xCukupJamArr.filter(x => !listModulLuar.includes(x));
          this.getListAttReason(diffML);
        }
      }
    }, err => console.error(err));
  }

  async getListAttReason(diffML) {
    const listAttendanceReasons = [];
    const arr = [];
    this.sqlite.getListAttendanceReason().then((data) => {
      this.listAttendanceReason = data;
      for (let i = 0; i <= Object.keys(this.listAttendanceReason).length; i++) {
        listAttendanceReasons.push(JSON.stringify(this.listAttendanceReason[i].date));
        if ((i + 1) === (Object.keys(this.listAttendanceReason).length)) {
          const diff = diffML.filter(x => !listAttendanceReasons.includes(x));
          this.getDayMinusWeekendTCJ(diff);
        }
      }

    }, err => console.error(err));
  }

  // tolak weekend
  async getDayMinusWeekendTCJ(diffML) {
    const dayMinusWeekend = [];
    for (let i = diffML.length - 1; i >= 0; i--) {
      const today = new Date(diffML[i]);
      today.setMonth(today.getMonth());
      if (today.getDay() === 6 || today.getDay() === 0) {
        diffML.splice(i, 1);
        dayMinusWeekend.push(diffML);
      }
    }

    if (dayMinusWeekend.length === 0) {
      this.sqlite.getTimeInTimeOut(diffML).then((dataA) => {
        this.sqlite.saveKemasukanAlasanTCJ(dataA);
      }, err => console.error(err));
    } else {
      this.sqlite.getTimeInTimeOut(dayMinusWeekend).then((dataA) => {
        this.sqlite.saveKemasukanAlasanTCJ(dataA);
      }, err => console.error(err));
    }
  }

  async insertListAttendanceHADIRLEWAT() {
    const hadirLewatArr = [];
    await this.sqlite.getListHadirLewat().then((data) => {
      this.listHadirLewat = data;
      for (let i = 0; i <= Object.keys(this.listHadirLewat).length; i++) {
        hadirLewatArr.push(JSON.stringify(this.listHadirLewat[i].date));
        if ((i + 1) === (Object.keys(this.listHadirLewat).length)) {
          this.getListML4(hadirLewatArr);
        }
      }
    }, err => console.error(err));
  }

  async getListML4(hadirLewatArr) {
    const listModulLuar = [];
    this.sqlite.getModulLuar().then((data) => {
      this.listModulLuarData = data;
      for (let i = 0; i <= Object.keys(this.listModulLuarData).length; i++) {
        listModulLuar.push(JSON.stringify(this.listModulLuarData[i].date));
        if ((i + 1) === (Object.keys(this.listModulLuarData).length)) {
          const diffML = hadirLewatArr.filter(x => !listModulLuar.includes(x));
          this.getListAttReason2(diffML);

        }
      }
    }, err => console.error(err));
  }

  async getListAttReason2(diffML) {
    const listAttendanceReasons = [];
    const arr = [];
    this.sqlite.getListAttendanceReason().then((data) => {
      this.listAttendanceReason = data;
      for (let i = 0; i <= Object.keys(this.listAttendanceReason).length; i++) {
        listAttendanceReasons.push(JSON.stringify(this.listAttendanceReason[i].date));
        if ((i + 1) === (Object.keys(this.listAttendanceReason).length)) {
          const diff = diffML.filter(x => !listAttendanceReasons.includes(x));
          this.sqlite.getTimeInTimeOut(diff).then((dataA) => {
            this.sqlite.saveKemasukanAlasanHadirLewat(dataA);
          }, err => console.error(err));
        }
      }

    }, err => console.error(err));
  }

  async insertListAttendanceKELUARAWAL() {
    const keluarAwalArr = [];
    await this.sqlite.getListKeluarAwal().then((data) => {
      this.listKeluarAwal = data;
      this.sqlite.saveKemasukanAlasanKeluarAwal(data);
    }, err => console.error(err));
  }
  // END CODE FOR KEMASUKAN ALASAN.


  updateLeaveDetails(postData: any) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    this.http.put(this.apiUrl + 'user_view_leave/' + postData.ealv_startdate + '/', postData, options).subscribe((data: any) => {

      },
      err => console.error('error ' + JSON.stringify(err))
    );
  }

  async InsertLeaveDetails(postData: any) {
    await this.getApiKey().then((data: string) => this.token = data);
    if (this.token) {
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        })
      };
      this.http.post(this.apiUrl + 'user_view_leave/', postData, options).subscribe((data: any) => {},
        err => console.error('error ' + JSON.stringify(err))
      );
    }
  }

  updateLulusTugasLuar(postData: any) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    this.http.put(this.apiUrl + 'lulus_tugas_luar/' + postData.eakur_id + '/', postData, options).subscribe((data: any) => {},
      err => console.error('error ' + JSON.stringify(err))
    );
  }

  deleteLeaveDetails(postData: any) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    this.http.delete(this.apiUrl + 'user_view_leave/' + postData + '/', options).subscribe((Data: any) => {},
      err => console.error('error ' + JSON.stringify(err))
    );
  }


  UpdateCourses(postData: any) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    this.http.put(this.apiUrl + 'modul_tugas_luar/' + postData.eakur_id + '/', postData, options).subscribe((data: any) => {},
      err => console.error('error ' + JSON.stringify(err))
    );
  }

  deleteCourseDetails(postData: any) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    this.http.delete(this.apiUrl + 'modul_tugas_luar/' + postData + '/', options).subscribe((Data: any) => {},
      err => console.error('error ' + JSON.stringify(err))
    );
  }

  async InsertCoursesDetails(postData: any) {
    await this.getApiKey().then((data: string) => this.token = data);
    if (this.token) {
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        })
      };
      this.http.post(this.apiUrl + 'modul_tugas_luar/', postData, options).subscribe((data: any) => {
          this.sqlite.updateKemasukanAlasan(postData);
        },
        err => {
          this.errorToast();
          console.error('error ' + JSON.stringify(err));
        }
      );
    }
  }

  async InsertAddAlasan(postData: any) {
    await this.getApiKey().then((data: string) => this.token = data);
    if (this.token) {
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        })
      };
      this.http.post(this.apiUrl + 'add_alasan/', postData, options).subscribe((data: any) => {
          this.sqlite.updateKemasukanAlasan(postData);
        },
        err => {
          this.errorToast();
          console.error('error ' + JSON.stringify(err));
        }
      );
    }
  }

  async getPersonal() {
    this.http.get(this.apiUrl + 'user_profile?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.savePersonal(data);
          this.sqlite.savePelulus(data);
          this.sqlite.saveWaktuSemasa();
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getTotalCourse() {
    this.http.get(this.apiUrl + 'total_course?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveTotalCourse(data);
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getCardColor() {
    this.http.get(this.apiUrl + 'card_color?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveCardColor(data);
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getTotalLeave() {
    this.http.get(this.apiUrl + 'total_leave?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveTotalLeaves(data);
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getWaktuKerja() {
    this.http.get(this.apiUrl + 'waktu_bekerja?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveWorkHour(data);
          this.sqlite.saveTimeInOut(data);
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getWaktuMasukKeluar() {
    this.http.get(this.apiUrl + 'waktu_bekerja?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveTimeInOut(data);
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async getReaderType() {
    this.http.get(this.apiUrl + 'status_reader?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveStatusReader(data);
          this.sqlite.saveSessionLogin();
        },
        error => console.log('error', JSON.stringify(error)));
  }

  async PelulusGetListReasonForApproval() {
    this.http.get(this.apiUrl + 'list_alasan_for_approval?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveReasonForApproval(data);
        },
        error => console.log('oops', JSON.stringify(error)));
  }

  async pelulusUpdateReasonApproval(postData: any) {
    return new Promise < object > ((resolve) => {
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        })
      };
      this.http.put(this.apiUrl + 'list_alasan_for_approval/' + postData.ealt_staffid + '/', postData, options)
        .subscribe((response: any) => {
          resolve(response);
        }, err => {
          this.errorToast();
          console.error('error' + JSON.stringify(err));
        });
    });
  }

  async getCodeReason() {
    this.http.get(this.apiUrl + 'code_reason?access_token=' + this.token, httpOptions)
      .subscribe((data: any) => {
          this.sqlite.saveCodeReason(data);
        },
        error => console.log('error code reason', JSON.stringify(error)));
  }

  async errorToast() {
    const toast = await this.toastCtrl.create({
      message: 'MASALAH RANGKAIAN. SILA CUBA SEBENTAR LAGI',
      color: 'danger',
      duration: 5000
    });
    await toast.present();
  }
}
