import { JsonpClientBackend } from '@angular/common/http';
import { Icu } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { json } from 'ngx-custom-validators/src/app/json/validator';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  public totalcourse = 0;
  public totalleave = 0;

  constructor(
    private sqlite: SQLite
  ) { }

  // create and open database
  public initDB() {
    return this.sqlite.create({
      name: 'iManagement',
      location: 'default'
    });
  }

  // create and open database
  public initDBSession() {
    return this.sqlite.create({
      name: 'iManagement_session',
      location: 'default'
    });
  }

  // close opened connection
  public closedbConnection() {
    this.initDB()
      .then((db) => {
        db.close();
      });
  }

  public closedbConnection1() {
    this.initDBSession()
      .then((dbSes) => {
        dbSes.close();
      });
  }

  // create related tables
  createDb() {
    this.initDB()
      .then((db: SQLiteObject) => {
        // create table leave here
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS Leave (
          id INTEGER PRIMARY KEY, \
          ealv_staffid varchar, \
          ealv_startdate DATE, \
          ealv_enddate DATE, \
          ealv_noofdays INTEGER, \
          ealv_leavecode varchar(255), \
          ealv_applydatetime DATETIME, \
          ealv_approval varchar(255), \
          ealv_applystaffid varchar(255),\
          ealv_remark varchar(255) \
          )
        `, []
        )
            .then(() => console.log('leave created'))
            .catch(e => console.log(e));


        // create table leave code
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS LeaveCode (
          id INTEGER PRIMARY KEY, \
          eaal_leavekod varchar(255), \
          eaal_leavedesc varchar(255), \
          eaal_leavering varchar(255), \
          eaal_refshift varchar(255), \
          eaal_refmaxday varchar(255), \
          eaal_jamlayak varchar(255), \
          eaal_indapply varchar(255), \
          eaal_refbakicuti varchar(255), \
          eaal_backdate varchar(255), \
          eaal_oldcode varchar(255) \
          )
        `, []
        )
          .then(() => console.log('ListLeave code create'))
          .catch(e => console.log(e));

        // create personal table
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS personal (
          id INTEGER PRIMARY KEY, \
          staffId varchar(255), \
          staffName varchar(255), \
          icNumber INTEGER, \
          email varchar(255), \
          grade varchar(255), \
          jawatan varchar(255), \
          role varchar(255), \
          pelulusId varchar(255) \
          )
        `, []
        )
            .then(() => console.log('personal created'))
            .catch(e => console.log(e));

        // create totalcourse table
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS totalcourse (
          id INTEGER PRIMARY KEY, \
          kursusId INTEGER, \
          startDate DATE, \
          endDate DATE, \
          days INTEGER, \
          bilJam INTEGER, \
          timeStart TIME, \
          timeEnd TIME, \
          outCode INTEGER \
          )
        `, []
        )
            .then(() => console.log('totalcourse created'))
            .catch(e => console.log(e));

        // create cardcolor table
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS cardcolor (
          id INTEGER PRIMARY KEY, \
          staffId varchar(255), \
          date DATE, \
          remark varchar(255), \
          supervisor varchar(255), \
          status INTEGER, \
          color varchar(255), \
          bilLewat INTEGER, \
          timeUpdate DATE \
          )
        `, []
        )
            .then(() => console.log('cardcolor created'))
            .catch(e => console.log(e));

        // create totalleave table
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS totalleave (
          id INTEGER PRIMARY KEY, \
          staffId varchar(255), \
          startDate DATE, \
          endDate DATE, \
          leaveCode varchar(255), \
          numOfDays INTEGER, \
          remark varchar(255), \
          applyDateTime DATE, \
          approval INTEGER, \
          applyStaffId INTEGER \
          )
        `, []
        )
            .then(() => console.log('totalleave created'))
            .catch(e => console.log(e));

        // create table waktu kerja
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS workhour (
          id INTEGER PRIMARY KEY, \
          shiftUserId varchar(255), \
          shiftFrom DATE, \
          shiftEnd DATE, \
          shiftCode varchar(255), \
          startTime DATETIME, \
          endTime DATETIME, \
          jamKerja DATETIME \
          )
        `, []
        )
            .then(() => console.log('workhour created'))
            .catch(e => console.log(e));

        // create table waktu masuk/keluar
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS timeInOut (
          id INTEGER PRIMARY KEY, \
          thisDate DATE, \
          thisTime DATETIME, \
          codeDesc varchar(255), \
          attendanceCode INTEGER \
          )
        `, []
        )
            .then(() => console.log('timeInOut created'))
            .catch(e => console.log(e));

        // create table statusreader
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS statusreader (
          id INTEGER PRIMARY KEY, \
          readerstatId INTEGER, \
          doorDesc varchar(255), \
          readerstatStatus INTEGER, \
          readerstatDatetime DATETIME, \
          timeCheck DATETIME, \
          lasttimeCheck DATETIME, \
          doorId INTEGER, \
          doorIpaddr varchar(255), \
          readertypeDesc varchar(255) \
          )
        `, []
        )
            .then(() => console.log('statusreader created'))
            .catch(e => console.log(e));

        // create table list reason for approval here
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS reasonapproval (
          id INTEGER PRIMARY KEY, \
          ealt_staffid varchar, \
          easf_staffname varchar, \
          ealt_latetime TIME, \
          ealt_latecode varchar, \
          tkh_alasan DATE, \
          ealt_date DATE, \
          ealt_remark varchar, \
          time_alasan TIME, \
          easc_greddesc varchar, \
          easc_jawatandesc varchar, \
          cawang_desc varchar ,\
          jab_desc varchar, \
          alasan_desc varchar, \
          easf_namapegang varchar, \
          easf_cardtype varchar, \
          check_in TIME, \
          check_out TIME, \
          jamkerja TIME, \
          lulus_time DATETIME, \
          pelulus_id varchar, \
          status varchar, \
          catitan varchar,\
          date varchar\
          )
        `, []
        )
            .then(() => console.log('reasonapproval created'))
            .catch(e => console.log(e));
        // create table Code Kursus
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS CodeKursus (
          id INTEGER PRIMARY KEY, \
          eaal_outkod varchar(255), \
          eaal_outdesc varchar(255), \
          eaal_kelulusan varchar(255), \
          eaal_hour varchar(255), \
          eaal_tntmohon varchar(255) \
          )
          `, []
        )
          .then(() => console.log('Senarai Code Kursus create'))
          .catch(e => console.log(e));

        // create table Senarai tugas luar
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS SenaraiTugas (
          id INTEGER PRIMARY KEY, \
           eakur_id varchar(255), \
           eakur_staffid varchar(255), \
           easf_staffname varchar(255), \
           eakur_name varchar(255), \
           eakur_location varchar(255), \
           kur_mula varchar(255), \
           kur_tmt DATETIME,\
           eakur_start DATETIME,\
           eakur_end varchar(255),\
           eakur_outkod  varchar(255), \
           eakur_anjuran varchar(255), \
           eakur_noday INTEGER, \
           eakur_kehadir varchar(255), \
           eakur_wakil varchar(255), \
           eakur_doc varchar(255), \
           eakur_timestart DATETIME,\
           eakur_timeend DATETIME, \
           eakur_apply DATE, \
           eakur_rujukan varchar(255), \
           kursus_mula DATE, \
           kursus_end  DATE, \
           eakur_biljam DATETIME(255), \
           eakur_status varchar(255), \
           eakur_approveby varchar(255), \
           pelulus  varchar(255) \
          )
          `, []
        )
          .then(() => console.log('Senarai Luar code create'))
          .catch(e => console.log(e));

        // create table Code Kursus
        db.executeSql(`
          CREATE TABLE IF NOT EXISTS CodeKursus (
            id INTEGER PRIMARY KEY, \
            eaal_outkod varchar(255), \
            eaal_outdesc varchar(255), \
            eaal_kelulusan varchar(255), \
            eaal_hour varchar(255), \
            eaal_tntmohon varchar(255) \
          )
          `, []
        )
          .then(() => console.log('Senarai Code Kursus create'))
          .catch(e => console.log(e));

              // create table lulus tugas luar
        db.executeSql(`
          CREATE TABLE IF NOT EXISTS TugasLuar (
            id INTEGER PRIMARY KEY, \
            eakur_id varchar(255), \
            eakur_staffid varchar(255), \
            eaal_hour  varchar(255), \
            tkh_mula  DATE, \
            tkh_tamat DATE, \
            time_mula DATE, \
            time_tamat DATE, \
            eakur_noday  INTEGER, \
            eakur_biljam DATETIME, \
            eakur_start  DATE, \
            eakur_apply  DATE, \
            eakur_name   varchar, \
            eakur_anjuran varchar(255), \
            eakur_location varchar(255),  \
            eakur_approved_id varchar(255),  \
            eakur_approveby varchar(255), \
            eakur_approveby2 varchar(255), \
            eakur_status varchar(255), \
            eakur_appdate varchar(255), \
            eakur_outkod varchar(255), \
            eaal_outdesc varchar(255), \
            easf_staffname varchar(255), \
            easf_cardtype varchar(255), \
            easf_namapegang varchar(255) \
          )
          `, []
        )
          .then(() => console.log('TugasLuar code create'))
          .catch(e => console.log(e));

        // create table for kemasukan kehadiran (modul kehadiran)
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS attendanceuser (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          time_in TIME,\
          time_out TIME, \
          total_work varchar(255) \
        )
        `, []
        )
          .then(() => console.log('attendanceuser is created'))
          .catch(e => console.log(e));

           // create table for alasan  kehadiran (modul kehadiran)
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS ReasonKehadiran (
          id INTEGER PRIMARY KEY, \
          alas_id varchar(255), \
          alas_jenis varchar(255),\
          alas_catatan varchar (255), \
          alas_mohon varchar(255) \
        )
        `, []
        )
          .then(() => console.log('ReasonKehadiran is created'))
          .catch(e => console.log(e));

        // create table for reason lewat
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS attendancelate (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          remark varchar(255), \
          latecode varchar(255), \
          alasan_desc varchar(255),\
          ealt_status varchar (255) \
        )
        `, []
        )
          .then(() => console.log('attendancelate is created'))
          .catch(e => console.log(e));

        // create table for reason lewat KIV
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS attendancelateKIV (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          remark varchar(255), \
          latecode varchar(255), \
          alasan_desc varchar(255),\
          ealt_status varchar (255),\
          ealt_catit varchar (255), \
          ealt_timein varchar (255), \
          ealt_timeout varchar (255), \
          ealt_jamkerja varchar (255) \
        )
        `, []
        )
          .then(() => console.log('attendancelateKIV is created'))
          .catch(e => console.log(e));

        // create table for publicholiday
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS publicholiday (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          desc varchar(255) \
        )
        `, []
        )
          .then(() => console.log('publicholiday is created'))
          .catch(e => console.log(e));

        // create table for leave
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS attendanceleave (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          desc varchar(255), \
          remark varchar(255), \
          leavecode varchar(255) \
        )
        `, []
        )
          .then(() => console.log('attendanceleave is created'))
          .catch(e => console.log(e));
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS attendancetugasluar (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          desc varchar(255), \
          name varchar(255), \
          outkod varchar(255) \
        )
        `, []
        )
          .then(() => console.log('attendancetugasluar is created'))
          .catch(e => console.log(e));
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS kemasukanalasan (
          id INTEGER PRIMARY KEY, \
          date DATE, \
          jenis_kehadiran varchar(255), \
          jenis_kehadiran_desc varchar(255), \
          alasan_ring varchar(255), \
          masuk TIME, \
          keluar TIME, \
          jamkerja TIME,
          ealt_catit varchar(255), \
          type varchar(255),\
          status varchar(255) \
        )
        `, []
        )
          .then(() => console.log('kemasukanalasan is created'))
          .catch(e => console.log(e));

          // Table kod alasan
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS KodAlasan (
          id INTEGER PRIMARY KEY, \
          alasan_id INTEGER, \
          alasan_desc varchar(255), \
          alasan_ring varchar(255) \
        )
        `, []
        )
          .then(() => console.log('KodAlasan is created'))
          .catch(e => console.log(e));

         // Table Pelulus
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS pelulus (
          id INTEGER PRIMARY KEY, \
          pelulusId INTEGER, \
          pelulusName varchar(255), \
          pelulusStat INTEGER, \
          dateResign DATE \
        )
        `, []
        )
          .then(() => console.log('pelulus is created'))
          .catch(e => console.log(e));

         // Table Waktu Semasa
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS waktusemasa (
          id INTEGER PRIMARY KEY, \
          tarikh TIMESTAMP \
        )
        `, []
         )
           .then(() => console.log('waktusemasa is created'))
           .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  createDbSession() {
    this.initDBSession()
      .then((db: SQLiteObject) => {
        db.executeSql(`
        CREATE TABLE IF NOT EXISTS loginsession (
          id INTEGER PRIMARY KEY, \
          tarikh TIMESTAMP \
        )
        `, []
        )
          .then(() => console.log('loginsession is created'))
          .catch(e => console.log(e));

        })
      .catch(e => console.log(e));
  }

  dropDb() {
    this.sqlite.deleteDatabase({ name: 'iManagement', location: 'default'});
    this.createDb();
  }

  dropDbSession() {
    this.sqlite.deleteDatabase({ name: 'iManagement_session', location: 'default'});
    this.createDbSession();
  }

  // save total course
 saveWaktuSemasa() {

    const now = new Date();
    console.log('tarikh' + JSON.stringify(now));

    this.initDB()
    .then((db: SQLiteObject) => {
      console.log('begin insert into waktusemasa');
      db.executeSql('INSERT INTO waktusemasa \
        (tarikh)\
        VALUES (?)',
            [now]);
      }, err => console.error(err));
}

  // save personal
  savePersonal(personal: any) {
    const role = personal[3];
    const staffId = personal[0].easf_staffid;
    const username =  personal[0].easf_staffname;
    const email =  personal[0].easf_email;
    const mykad =  personal[0].easf_icno;
    const grade = personal[1].easc_greddesc;
    const jawatan = personal[2].easc_jawatandesc;

    this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into personal');
        db.executeSql('INSERT INTO personal \
          (staffId, \
            staffName, \
            icNumber, \
            email, \
            grade, \
            jawatan, \
            role) \
          VALUES (?, ?, ?, ?, ?, ?, ?)',
              [staffId, username, mykad, email, grade, jawatan, role]);
          }, err => console.error(err));
  }

  // save nama pelulus
  savePelulus(pelulus: any) {
    const pelulusId = pelulus[4].pelulus_id_1;
    const pelulusName = pelulus[4].easf_staffname;
    const pelulusStat = pelulus[4].pelulus_stat;
    const dateResign = pelulus[4].easf_dateresign;

    this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into pelulus');
        db.executeSql('INSERT INTO pelulus \
          (pelulusId, \
            pelulusName, \
            pelulusStat, \
            dateResign)\
          VALUES (?, ?, ?, ?)',
              [pelulusId, pelulusName, pelulusStat, dateResign]);
        }, err => console.error(err));
  }


 // save total course
 saveTotalCourse(totalcourse: any) {
  for (const element of totalcourse) {
    console.log('begin insert data into totalcourse');
    const courseId = element.eakur_id;
    const startDate = element.eakur_start;
    const endDate = element.eakur_end;
    const noDay = element.eakur_noday;
    const bilJam = element.eakur_biljam;
    const timeStart = element.eakur_timestart;
    const timeEnd = element.eakur_timeend;
    const outKod = element.eakur_outkod;

    this.initDB()
    .then((db: SQLiteObject) => {
      console.log('begin insert into totalcourse');
      db.executeSql('INSERT INTO totalcourse \
        (kursusId, \
          startDate, \
          endDate, \
          days, \
          bilJam, \
          timeStart, \
          timeEnd, \
          outCode)\
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [courseId, startDate, endDate, noDay, bilJam, timeStart, timeEnd, outKod]);
      }, err => console.error(err));
    }
}


  // save card color
  saveCardColor(cardcolour: any) {
    for (const element of cardcolour) {
      console.log('begin insert data into cardcolor');
      const staffId = element.eakad_staffid;
      const date = element.eakad_date;
      const remark = element.eakad_remark;
      const supervisor = element.eakad_supervisor;
      const status = element.eakad_status;
      const color = element.eakad_color;
      const bilLewat = element.eakad_bilewat;
      const timeUpdate = element.eakad_timeupd;

      this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into cardcolor');
        db.executeSql('INSERT INTO cardcolor \
          (staffId, \
            date, \
            remark, \
            supervisor, \
            status, \
            color, \
            bilLewat, \
            timeUpdate)\
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [staffId, date, remark, supervisor, status, color, bilLewat, timeUpdate]);
        }, err => console.error(err));
      }
  }

  // save totalleave
  saveTotalLeaves(totalleaves: any) {
    for (const element of totalleaves) {
      console.log('begin insert data into totalleave');
      const staffId = element.ealv_staffid;
      const startDate = element.ealv_startdate;
      const endDate = element.ealv_enddate;
      const leaveCode = element.ealv_leavecode;
      const numOfDays = element.ealv_noofdays;
      const remark = element.ealv_remark;
      const applyDateTime = element.ealv_applydatetime;
      const approval = element.ealv_approval;
      const applyStaffId = element.ealv_approval;

      this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into totalleave');
        db.executeSql('INSERT INTO totalleave \
          (staffId, \
            startDate, \
            endDate, \
            leaveCode, \
            numOfDays, \
            remark, \
            applyDateTime, \
            approval, \
            applyStaffId)\
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [staffId, startDate, endDate, leaveCode, numOfDays, remark, applyDateTime, approval, applyStaffId]);
          }, err => console.error(err));
      }
  }

  // save work hour
  saveWorkHour(workhour: any) {
    const shiftUserId = workhour[0].shift_userid;
    const shiftFrom = workhour[0].shift_frdt;
    const shiftEnd = workhour[0].shift_enddt;
    const shiftCode = workhour[0].shift_code;
    const startTime = workhour[0].eaws_starttime;
    const endTime = workhour[0].eaws_endtime;
    const jamKerja = workhour[0].jamkerja;
    this.initDB()
    .then((db: SQLiteObject) => {
      console.log('begin insert into workhour');
      db.executeSql('INSERT INTO workhour \
        (shiftUserId, \
          shiftFrom, \
          shiftEnd, \
          shiftCode, \
          startTime, \
          endTIme, \
          jamKerja)\
        VALUES (?, ?, ?, ?, ?, ?, ?)',
            [shiftUserId, shiftFrom, shiftEnd, shiftCode, startTime, endTime, jamKerja]);
      }, err => console.error(err));
}


  // save waktu masuk/keluar
  saveTimeInOut(timeinout: any) {
      for (const elements of timeinout) {
        const thisDate = elements.tarikh;
        const thisTime = elements.masa;
        const codeDesc = elements.cod_ketrngks;
        const attendanceCode = elements.eaax_txnflag;

        this.initDB()
        .then((db: SQLiteObject) => {
        console.log('begin insert into timeInOut');
        db.executeSql('INSERT INTO timeInOut \
          (thisDate, \
            thisTime, \
            codeDesc, \
            attendanceCode)\
          VALUES (?, ?, ?, ?)',
              [thisDate, thisTime, codeDesc, attendanceCode]);
        }, err => console.error(err));
      }
  }


  // save status reader
  saveStatusReader(statreader: any) {
    for (const element of statreader) {
      console.log('begin insert data into statusreader');
      const readerstatId = element.readerstat_id;
      const doorDesc = element.door_desc;
      const readerstatStatus = element.readerstat_stat;
      const readerstatDatetime = element.readerstat_datetime;
      const timeCheck = element.time_check;
      const lasttimeCheck = element.last_sedut;
      const doorId = element.door_id;
      const doorIpaddr = element.door_ipaddr;
      const readertypeDesc = element.rdrtype_desc;

      this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into statusreader');
        db.executeSql('INSERT INTO statusreader \
          (readerstatId, \
            doorDesc, \
            readerstatStatus, \
            readerstatDatetime, \
            timeCheck, \
            lasttimeCheck, \
            doorId, \
            doorIpaddr, \
            readertypeDesc)\
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [readerstatId, doorDesc, readerstatStatus, readerstatDatetime, timeCheck, lasttimeCheck, doorId, doorIpaddr, readertypeDesc]);
          }, err => console.error(err));
      }
  }

  // save data from API into table Jenis Tugas Luar List
  saveCodeTugasLuar(CodeTugas: any) {
    for (const elements of CodeTugas) {
      const Code = elements.eaal_outkod;
      const CodeDesc = elements.eaal_outdesc;
      const Kelulusan = elements.eaal_kelulusan;
      const Hour = elements.eaal_hour;
      const Tntmohon = elements.eaal_tntmohon;
      this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert CodeKursus');
                db.executeSql('INSERT INTO CodeKursus \
              ( eaal_outkod, \
                eaal_outdesc, \
                eaal_kelulusan, \
                eaal_hour, \
               eaal_tntmohon) \
              VALUES (?, ?, ?, ?, ? )',
                  [Code, CodeDesc, Kelulusan, Hour, Tntmohon]);
              }, err => console.error(err));
        }
  }

      // save data from API into table Leave
      saveLeave(leave: any) {
        for (const element of leave) {
            const staffId = element.ealv_staffid;
            const startDate = element.ealv_startdate;
            const endDate = element.ealv_enddate;
            const noOfDays = element.ealv_noofdays;
            const leaveCode = element.ealv_leavecode;
            const applyDateTime = element.ealv_applydatetime;
            const approval = element.ealv_approval;
            const applystaffId = element.ealv_applystaffid;
            const remark = element.ealv_remark;
            this.initDB()
                    .then((db: SQLiteObject) => {
                      console.log('begin insert Leave');
                      db.executeSql('INSERT INTO Leave \
                    (ealv_staffid, \
                      ealv_startdate, \
                      ealv_enddate, \
                      ealv_noofdays, \
                      ealv_leavecode, \
                      ealv_applydatetime, \
                      ealv_approval, \
                      ealv_applystaffid,\
                      ealv_remark) \
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [staffId, startDate, endDate, noOfDays, leaveCode, applyDateTime, approval, applystaffId, remark]);
                    }, err => console.error(err));
                }
              }

          // save data from API into table Leave List
          saveLeaveCode(leave: any) {
            for (const elements of leave) {
              const leaveCode = elements.eaal_leavekod;
              const leavedesc = elements.eaal_leavedesc;
              const leavering = elements.eaal_leavering;
              const refshift = elements.eaal_refshift;
              const refmaxday = elements.eaal_refmaxday;
              const jamlayak = elements.eaal_jamlayak;
              const indapply = elements.eaal_indapply;
              const refbakicuti = elements.eaal_refbakicuti;
              const backdate = elements.eaal_backdate;
              const oldcode = elements.eaal_oldcode;

              this.initDB()
                      .then((db: SQLiteObject) => {
                        console.log('begin insert LeaveCode');
                        db.executeSql('INSERT INTO LeaveCode \
                      (eaal_leavekod, \
                        eaal_leavedesc, \
                        eaal_leavering, \
                        eaal_refshift, \
                        eaal_refmaxday, \
                        eaal_jamlayak, \
                        eaal_indapply, \
                        eaal_refbakicuti, \
                        eaal_backdate, \
                        eaal_oldcode) \
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                          [leaveCode, leavedesc, leavering, refshift, refmaxday, jamlayak, indapply, refbakicuti, backdate, oldcode]);
                      }, err => console.error(err));
                }
          }

          // save data from API into table Tugas Luar
          saveLulusTugas(Tugas: any) {
            for (const elements of Tugas) {
              const KurSId = elements.eakur_id;
              const Kurstaffid = elements.eakur_staffid;
              const Hour =  elements.eaal_hour;
              const TarikhMula = elements.tkh_mula;
              const TarikhTamat = elements.tkh_tamat;
              const TimeMula = elements.time_mula;
              const TimeTamat = elements.time_tamat;
              const NoOfDay = elements.eakur_noday;
              const BilJam = elements.eakur_biljam;
              const KurStart = elements.eakur_start;
              const KursApply = elements.eakur_apply;
              const Kurname = elements.eakur_name;
              const KurAnjuran = elements.eakur_anjuran;
              const KurLocation = elements.eakur_location;
              const ApprovedID = elements.eakur_approved_id;
              const Approved1 = elements.eakur_approveby;
              const Approved2 = elements.eakur_approveby2;
              const Status =  elements.eakur_status;
              const Appdate = elements.eakur_appdate;
              const KurOutKod = elements.eakur_outkod;
              const Outdesc = elements.eaal_outdesc;
              const Staffname = elements.easf_staffname;
              const Cardtype = elements.easf_cardtype;
              const Namapegang = elements.easf_namapegang;
              this.initDB()
                      .then((db: SQLiteObject) => {
                        console.log('begin insert Tugas Luar');
                        db.executeSql('INSERT INTO TugasLuar \
                      (eakur_id, \
                        eakur_staffid, \
                        eaal_hour, \
                        tkh_mula, \
                        tkh_tamat, \
                        time_mula, \
                        time_tamat, \
                        eakur_noday, \
                        eakur_biljam, \
                        eakur_start, \
                        eakur_apply, \
                        eakur_name, \
                        eakur_anjuran, \
                        eakur_location,  \
                        eakur_approved_id, \
                        eakur_approveby, \
                        eakur_approveby2, \
                        eakur_status, \
                        eakur_appdate, \
                        eakur_outkod, \
                        eaal_outdesc, \
                        easf_staffname, \
                        easf_cardtype, \
                        easf_namapegang) \
                        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [KurSId, Kurstaffid, Hour, TarikhMula, TarikhTamat, TimeMula, TimeTamat, NoOfDay, BilJam, KurStart, KursApply,
                          Kurname, KurAnjuran, KurLocation, ApprovedID, Approved1, Approved2, Status, Appdate, KurOutKod, Outdesc,
                          Staffname, Cardtype, Namapegang]);
                          },
                        err => console.error(err));
                    }

          }

        // save data from API into table Senarai Tugas Luar
        saveSenaraiTugas(ListTugas: any) {
          for (const elements of ListTugas) {
            const CoursesID = elements.eakur_id;
            const StaffID = elements.eakur_staffid;
            const StaffName = elements.easf_staffname;
            const KurName = elements.eakur_name;
            const KurLocation = elements.eakur_location;
            const KurMulaDate = elements.kur_mula;
            const KurTamatDate = elements.kur_tmt;
            const KurStartDate = elements.eakur_start;
            const KurEndDate = elements.eakur_end;
            const KurOutKod = elements.eakur_outkod;
            const KurAnjuran = elements.eakur_anjuran;
            const Kehadiran = elements.eakur_kehadir;
            const Wakil  = elements.eakur_wakil;
            const Doc = elements.eakur_doc;
            const Kurnoday = elements.eakur_noday;
            const KurTimeStart = elements.eakur_timestart;
            const KurTimeEnd = elements.eakur_timeend;
            const KurApply = elements.eakur_apply;
            const KurRujukan = elements.eakur_rujukan;
            const KurMula = elements.kursus_mula;
            const KurEnd = elements.kursus_end;
            const BilJam = elements.eakur_biljam;
            const Status = elements.eakur_status;
            const ApprovedBy = elements.eakur_approveby;
            const Pelulus = elements.pelulus;

            this.initDB()
                    .then((db: SQLiteObject) => {
                      console.log('begin insert Senarai Tugas');
                      db.executeSql('INSERT INTO SenaraiTugas \
                    (eakur_id, \
                      eakur_staffid, \
                      easf_staffname, \
                      eakur_name, \
                      eakur_location, \
                      kur_mula, \
                      kur_tmt,\
                      eakur_start,\
                      eakur_end,\
                      eakur_outkod,\
                      eakur_anjuran, \
                      eakur_kehadir, \
                      eakur_wakil, \
                      eakur_doc, \
                      eakur_noday, \
                      eakur_timestart,\
                      eakur_timeend, \
                      eakur_apply, \
                      eakur_rujukan, \
                      kursus_mula, \
                      kursus_end, \
                      eakur_biljam, \
                      eakur_status, \
                      eakur_approveby, \
                      pelulus)\
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [CoursesID, StaffID, StaffName, KurName, KurLocation, KurMulaDate, KurTamatDate, KurStartDate, KurEndDate,
                      KurOutKod, KurAnjuran, Kehadiran, Wakil, Doc, Kurnoday, KurTimeStart, KurTimeEnd, KurApply,
                      KurRujukan, KurMula, KurEnd, BilJam, Status, ApprovedBy, Pelulus]);
                      },
                    err => console.error(err));
                }
        }

            saveReasonForApproval(reason: any) {
            for (const element of reason) {
              const dateYmd = element.ealt_date;
              const a = dateYmd.split('-');
              const year = a[0];
              const month = a[1];
              const day = a[2];
              const dateNew = year + month + day;
              this.initDB()
                      .then((db: SQLiteObject) => {
                        console.log('begin insert reasonapproval');
                        db.executeSql('INSERT INTO reasonapproval \
                      (ealt_staffid, \
                        easf_staffname, \
                        ealt_latetime, \
                        ealt_latecode, \
                        tkh_alasan, \
                        ealt_date, \
                        ealt_remark, \
                        time_alasan,\
                        easc_greddesc,\
                        easc_jawatandesc,\
                        cawang_desc,\
                        jab_desc,\
                        alasan_desc,\
                        easf_namapegang,\
                        easf_cardtype,\
                        check_in,\
                        check_out,\
                        jamkerja,\
                        status,\
                        date) \
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                          [element.ealt_staffid,
                            element.easf_staffname,
                            element.ealt_latetime,
                            element.ealt_latecode,
                            element.tkh_alasan,
                            element.ealt_date,
                            element.ealt_remark,
                            element.time_alasan,
                            element.easc_greddesc,
                            element.easc_jawatandesc,
                            element.cawang_desc,
                            element.jab_desc,
                            element.alasan_desc,
                            element.easf_namapegang,
                            element.easf_cardtype,
                            element.check_in,
                            element.check_out,
                            element.jamkerja,
                            0, dateNew
                          ]);
                      }, err => console.error(err));
                  }
            }

        // save data attendance list from api
        saveListAttendance(ListAttendance: any) {
          for (const elements of ListAttendance) {
            // calculate total work
            if (elements.masa_masuk != null && elements.masa_keluar != null) {
              const start = elements.masa_masuk.split(':');
              const end = elements.masa_keluar.split(':');
              const startDate = new Date(0, 0, 0, start[0], start[1], 0);
              const endDate = new Date(0, 0, 0, end[0], end[1], 0);
              let diff = endDate.getTime() - startDate.getTime();
              const hours = Math.floor(diff / 1000 / 60 / 60);
              diff -= hours * 1000 * 60 * 60;
              const minutes = Math.floor(diff / 1000 / 60);
              const totalWork = (hours < 9 ? '0' : '') + hours + ':' + (minutes < 9 ? '0' : '') + minutes;
              // const totalWork = ;
              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert attendanceuser');
                db.executeSql('INSERT INTO attendanceuser \
              ( date, \
                time_in,\
                time_out, \
                total_work) \
                VALUES (?,?,?,?)',
                [elements.tarikh, elements.masa_masuk, elements.masa_keluar, totalWork]);
              },
            err => console.error(err));
            } else {
              const totalWork = null;
              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert attendanceuser');
                db.executeSql('INSERT INTO attendanceuser \
              ( date, \
                time_in,\
                time_out, \
                total_work) \
                VALUES (?,?,?,?)',
                [elements.tarikh, elements.masa_masuk, elements.masa_keluar, totalWork]);
              },
            err => console.error(err));
            }
          }
        }

        saveListAttendanceWithReason(ListAttendance: any) {
          for (const elements of ListAttendance) {
            const dateYmd = elements.dt_lewat;
            const a = dateYmd.split('-');
            const year = a[2];
            const month = a[1];
            const day = a[0];
            const dateNew = year + '-' + month + '-' + day;
            this.initDB()
            .then((db: SQLiteObject) => {
              console.log('begin insert attendancelate');
              db.executeSql('INSERT INTO attendancelate \
            ( date, \
              remark, \
              latecode, \
              alasan_desc, \
              ealt_status) \
              VALUES (?,?,?,?,?)',
              [dateNew,  elements.ealt_remark, elements.ealt_latecode, elements.alasan_desc, elements.ealt_status]);
            },
            err => console.error(err));
          }
        }

        saveListAttendanceWithReasonStatusKIV(ListAttendance: any) {
          for (const elements of ListAttendance) {
            const dateYmd = elements.dt_lewat;
            const a = dateYmd.split('-');
            const year = a[2];
            const month = a[1];
            const day = a[0];
            const dateNew = year + '-' + month + '-' + day;
            if (elements.ealt_status === '3') {
              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert attendancelateKIV');
                db.executeSql('INSERT INTO attendancelateKIV \
              ( date, \
                remark, \
                latecode, \
                alasan_desc, \
                ealt_status, \
                ealt_catit, \
                ealt_timein, \
                ealt_timeout, \
                ealt_jamkerja) \
                VALUES (?,?,?,?,?,?,?,?,?)',
                [dateNew,  elements.ealt_remark, elements.ealt_latecode, elements.alasan_desc,
                  elements.ealt_status, elements.ealt_catit, elements.ealt_timein, elements.ealt_timeout, elements.ealt_jamkerja]);
              },
            err => console.error(err));
            }
          }
        }

        savePublicHoliday(PH: any) {
          for (const elements of PH) {
            this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert publicholiday');
                db.executeSql('INSERT INTO publicholiday \
              ( date, \
                desc) \
                VALUES (?,?)',
                [elements.eahd_holdate, elements.eahd_holdesc]);
              },
            err => console.error(err));
          }
        }

        saveCuti(PH: any) {
          for (const elements of PH) {
              const startDate = elements.ealv_startdate;
              const a = startDate.split('-');
              const year = a[0];
              const month = a[1];
              const day = a[2];

              const dateNew = year + ',' + month + ',' + day;
              const dateNewer = new Date(dateNew);
              dateNewer.setMonth(dateNewer.getMonth());

              const endDate = elements.ealv_enddate;
              const b = endDate.split('-');
              const yearend = b[0];
              const monthend = b[1];
              const dayend = b[2];

              const dateEndNew = yearend + ',' + monthend + ',' + dayend;
              const dateEndNewer = new Date(dateEndNew);
              dateEndNewer.setMonth(dateEndNewer.getMonth());
              for (const d = dateNewer; d <= dateEndNewer; d.setDate(d.getDate() + 1)) {
                  const myDate = new Date(d);
                  const A = myDate.toLocaleString('fr-BE');
                  const asplit = A.split('/');
                  const yeara = asplit[2].substring(0, 4);
                  let montha = asplit[1];
                  let daya = asplit[0];
                  if (montha.length === 1) { montha = '0' + montha; }
                  if (daya.length === 1) { daya = '0' + daya; }
                  const date = yeara + '-' + montha + '-' + daya;

                  this.initDB()
                  .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO attendanceleave \
                  ( date, \
                    desc, \
                    remark, \
                    leavecode) \
                    VALUES (?,?,?,?)',
                    [date, elements.eaal_leavedesc, elements.ealv_remark, elements.ealv_leavecode]);
                  },
                  err => console.error(err));
              }
          }
        }

        saveModulTugasLuar(PH: any) {
          for (const elements of PH) {
              const startDate = elements.eakur_start;
              const a = startDate.split('-');
              const year = a[0];
              const month = a[1];
              const day = a[2];

              const dateNew = year + ',' + month + ',' + day;
              const dateNewer = new Date(dateNew);
              dateNewer.setMonth(dateNewer.getMonth());

              const endDate = elements.eakur_end;
              const b = endDate.split('-');
              const yearend = b[0];
              const monthend = b[1];
              const dayend = b[2];

              const dateEndNew = yearend + ',' + monthend + ',' + dayend;
              const dateEndNewer = new Date(dateEndNew);
              dateEndNewer.setMonth(dateEndNewer.getMonth());

              for (const d = dateNewer; d <= dateEndNewer; d.setDate(d.getDate() + 1)) {
                  const myDate = new Date(d);
                  const A = myDate.toLocaleString('fr-BE');
                  const asplit = A.split('/');

                  const yeara = asplit[2].substring(0, 4);
                  let montha = asplit[1];
                  let daya = asplit[0];
                  if (montha.length === 1) { montha = '0' + montha; }
                  if (daya.length === 1) { daya = '0' + daya; }
                  const date = yeara + '-' + montha + '-' + daya;
                  this.initDB()
                  .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO attendancetugasluar \
                  ( date, \
                    desc, \
                    name, \
                    outkod) \
                    VALUES (?,?,?,?)',
                    [date, elements.eaal_outdesc, elements.eakur_name, elements.eakur_outkod]);
                  },
                  err => console.error(err));
              }
          }
        }

        saveKemasukanAlasan(PH) {
          for (const elements of PH) {
            const parts = elements.split('-');
            const mydate = new Date(parts);
            const A = mydate.toLocaleString('fr-BE');
            const asplit = A.split('/');

            const yeara = asplit[2].substring(0, 4);
            let montha = asplit[1];
            let daya = asplit[0];
            if (montha.length === 1) { montha = '0' + montha; }
            if (daya.length === 1) { daya = '0' + daya; }
            const date = yeara  + '-' + montha   + '-' + daya;

            this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert kemasukanalasan');
                db.executeSql('INSERT INTO kemasukanalasan \
              ( date, \
                jenis_kehadiran, \
                jenis_kehadiran_desc, \
                alasan_ring, \
                masuk, \
                keluar, \
                jamkerja, \
                status) \
                VALUES (?,?,?,?,?,?,?,?)',
                [date, 90, 'Tidak Hadir', 'xhdr', null, null, null, 0]);
              },
            err => console.error(err));
          }
        }

        saveKemasukanAlasanTCJ(PH) {
          for (const elements of PH) {
            const dateObj = elements.date;
            const parts = dateObj.split('-');
            const mydate = new Date(parts);
            const A = mydate.toLocaleString('fr-BE');
            const asplit = A.split('/');

            const yeara = asplit[2].substring(0, 4);
            let montha = asplit[1];
            let daya = asplit[0];
            if (montha.length === 1) { montha = '0' + montha; }
            if (daya.length === 1) { daya = '0' + daya; }
            const date = yeara  + '-' + montha   + '-' + daya;
            this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert kemasukanalasan');
                db.executeSql('INSERT INTO kemasukanalasan \
              ( date, \
                jenis_kehadiran, \
                jenis_kehadiran_desc, \
                alasan_ring, \
                masuk, \
                keluar, \
                jamkerja, \
                status) \
                VALUES (?,?,?,?,?,?,?,?)',
                [date, 93, 'Tidak Cukup Jam', 'xjam', elements.time_in, elements.time_out, elements.total_work, 0]);
              },
            err => console.error(err));
          }
        }

        saveKemasukanAlasanHadirLewat(PH) {
          for (const elements of PH) {
            const dateObj = elements.date;
            const parts = dateObj.split('-');
            const mydate = new Date(parts);
            const A = mydate.toLocaleString('fr-BE');
            const asplit = A.split('/');

            const yeara = asplit[2].substring(0, 4);
            let montha = asplit[1];
            let daya = asplit[0];
            if (montha.length === 1) { montha = '0' + montha; }
            if (daya.length === 1) { daya = '0' + daya; }
            const date = yeara  + '-' + montha   + '-' + daya;
            this.initDB()
            .then((db: SQLiteObject) => {
              console.log('begin insert kemasukanalasan');
              db.executeSql('INSERT INTO kemasukanalasan \
            ( date, \
              jenis_kehadiran, \
              jenis_kehadiran_desc, \
              alasan_ring, \
              masuk, \
              keluar, \
              jamkerja, \
              status) \
              VALUES (?,?,?,?,?,?,?,?)',
              [date, 0, 'Hadir Lewat', 'lwt', elements.time_in, elements.time_out, elements.total_work, 0]);
            },
            err => console.error(err));
          }
        }

        saveKemasukanAlasanKeluarAwal(PH) {
          for (const elements of PH) {
            const dateObj = elements.date;
            const parts = dateObj.split('-');
            const mydate = new Date(parts);
            const A = mydate.toLocaleString('fr-BE');
            const asplit = A.split('/');

            const yeara = asplit[2].substring(0, 4);
            let montha = asplit[1];
            let daya = asplit[0];
            if (montha.length === 1) { montha = '0' + montha; }
            if (daya.length === 1) { daya = '0' + daya; }
            const date = yeara  + '-' + montha   + '-' + daya;
            this.initDB()
            .then((db: SQLiteObject) => {
              console.log('begin insert kemasukanalasan');
              db.executeSql('INSERT INTO kemasukanalasan \
            ( date, \
              jenis_kehadiran, \
              jenis_kehadiran_desc, \
              alasan_ring, \
              masuk, \
              keluar, \
              jamkerja, \
              status) \
              VALUES (?,?,?,?,?,?,?,?)',
              [date, 1, 'Keluar Awal', 'lwt', elements.time_in, elements.time_out, elements.total_work, 0]);
            },
            err => console.error(err));
          }
        }

        saveKemasukanAlasanTL(PH) {
          for (const elements of PH) {
            const dateObj = elements.date;
            const parts = dateObj.split('-');
            const mydate = new Date(parts);
            const A = mydate.toLocaleString('fr-BE');
            const asplit = A.split('/');

            const yeara = asplit[2].substring(0, 4);
            let montha = asplit[1];
            let daya = asplit[0];
            if (montha.length === 1) { montha = '0' + montha; }
            if (daya.length === 1) { daya = '0' + daya; }
            const date = yeara  + '-' + montha   + '-' + daya;

            const today = new Date();
            const todayA = today.toLocaleString('fr-BE');
            const splittodayA = todayA.split('/');

            const splitYear = splittodayA[2].substring(0, 4);
            let splitMonth = splittodayA[1];
            let splitDay = splittodayA[0];
            if (splitMonth.length === 1) { splitMonth = '0' + splitMonth; }
            if (splitDay.length === 1) { splitDay = '0' + splitDay; }
            const dateToday = splitYear  + '-' + splitMonth   + '-' + splitDay;
            if (elements.time_out === null && date !== dateToday) {
              const jenisKehadiran = 91;
              const jenisKehadiranDesc = 'Hadir Tidak Lengkap (thumb out)';

              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert kemasukanalasan');
                db.executeSql('INSERT INTO kemasukanalasan \
              ( date, \
                jenis_kehadiran, \
                jenis_kehadiran_desc, \
                alasan_ring, \
                masuk, \
                keluar, \
                jamkerja, \
                status) \
                VALUES (?,?,?,?,?,?,?,?)',
                [date, jenisKehadiran, jenisKehadiranDesc, 'xlgkp', elements.time_in, elements.time_out, elements.total_work, 0]);
              },
            err => console.error(err));
            } else if (elements.time_in === null) {
              const jenisKehadiran = 92;
              const jenisKehadiranDesc = 'Hadir Tidak Lengkap (thumb in)';

              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert kemasukanalasan');
                db.executeSql('INSERT INTO kemasukanalasan \
              ( date, \
                jenis_kehadiran, \
                jenis_kehadiran_desc, \
                alasan_ring,\
                masuk, \
                keluar, \
                jamkerja, \
                status) \
                VALUES (?,?,?,?,?,?,?,?)',
                [date, jenisKehadiran, jenisKehadiranDesc, 'xlgkp', elements.time_in, elements.time_out, elements.total_work, 0]);
              },
            err => console.error(err));
            }
          }
        }

        saveKemasukanAlasanKIV(PH) {
          for (const elements of PH) {
            const timeIn = elements.ealt_timein;
            const splitTimeIn = timeIn.split(':');
            const timeInNew = splitTimeIn[0] + ':' + splitTimeIn[1];

            const timeOut = elements.ealt_timeout;
            const splitTimeOut = timeIn.split(':');
            const timeOutNew = splitTimeOut[0] + ':' + splitTimeOut[1];

            const jamK = elements.ealt_jamkerja;
            const jamKerja = jamK.split(':');
            const jamKerjaNew = jamKerja[0] + ':' + jamKerja[1];

            this.initDB()
            .then((db: SQLiteObject) => {
              console.log('begin insert kemasukanalasan');
              db.executeSql('INSERT INTO kemasukanalasan \
            ( date, \
              jenis_kehadiran, \
              jenis_kehadiran_desc, \
              alasan_ring, \
              masuk, \
              keluar, \
              jamkerja, \
              ealt_catit, \
              type, \
              status) \
              VALUES (?,?,?,?,?,?,?,?,?,?)',
              [elements.date, elements.latecode, elements.alasan_desc, 'xlgkp', timeInNew, timeOutNew, jamKerjaNew, elements.ealt_catit, 'KIV', 0]);
            },
          err => console.error(err));
          }
        }


        // save kehadiran alasan
        SaveReasonKehadiran(Reason: any) {
          for (const element of Reason) {
            const alasanId = element.alas_id;
            const alasanJenis = element.alas_jenis;
            const alasanCatatan = element.alas_catatan;
            const alasanMohon = element.alas_mohon;

            this.initDB()
            .then((db: SQLiteObject) => {
              db.executeSql('INSERT INTO ReasonKehadiran \
                (alas_id, \
                  alas_jenis, \
                  alas_catatan, \
                  alas_mohon)\
                VALUES (?, ?, ?, ?)',
                    [alasanId, alasanJenis, alasanCatatan, alasanMohon]);
              }, err => console.error(err));
            }
        }


     // save code alasan
  saveCodeReason(codeReason: any) {
    for (const element of codeReason) {
      const alasanId = element.alasan_id;
      const alasanDesc = element.alasan_desc;
      const alasanRing = element.alasan_ring;

      this.initDB()
      .then((db: SQLiteObject) => {
        console.log('begin insert into kod alasan');
        db.executeSql('INSERT INTO KodAlasan \
          (alasan_id, \
            alasan_desc, \
            alasan_ring)\
          VALUES (?, ?, ?)',
              [alasanId, alasanDesc, alasanRing]);
        }, err => console.error(err));
      }
  }

  // save session login
  saveSessionLogin() {

    const now = new Date();
    console.log('tarikh session' + JSON.stringify(now));

    this.initDBSession()
    .then((dbSes: SQLiteObject) => {
      console.log('begin insert into loginsession');
      dbSes.executeSql('INSERT INTO loginsession \
        (tarikh)\
        VALUES (?)',
            [now]);
      }, err => console.error(err));
  }

  // get waktu semasa
  getWaktuSemasa() {
    return new Promise<object>((resolve) => {
      const waktu = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM waktusemasa', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                waktu.push({
                  id: data.rows.item(i).id,
                  tarikh: data.rows.item(i).tarikh,
                });
              }
              resolve( waktu );
            })
            .catch(e => console.log(e));
        });
    });
  }



    getReasonKehadiran(Type) {
    return new Promise<object>((resolve) => {
      const Kehadiran = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ReasonKehadiran where alas_jenis = ?', [Type])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                Kehadiran.push({
                  id: data.rows.item(i).id,
                  alasanId: data.rows.item(i).alas_id,
                  alasanJenis: data.rows.item(i).alas_jenis,
                  alasanCatatan: data.rows.item(i).alas_catatan,
                  alasanMohon: data.rows.item(i).alas_mohon,
                });
              }
              resolve(Kehadiran);
            })
            .catch(e => console.log(e));
        });
    });
  }

   // Get Alasan Kehadiran Lewat
   getSenaraiAlasanByLewat() {
    return new Promise<object>((resolve) => {
      const KehadiranTakHadir = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ReasonKehadiran WHERE alas_jenis = "lwt" ORDER BY alas_catatan ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                KehadiranTakHadir.push({
                  id: data.rows.item(i).id,
                  alas_id: data.rows.item(i).alas_id,
                  alas_jenis: data.rows.item(i).alas_jenis,
                  alas_catatan: data.rows.item(i).alas_catatan,
                  alas_mohon: data.rows.item(i).alas_mohon,
                });
              }
              resolve(KehadiranTakHadir);
            })
            .catch(e => console.log(e));
        });
    });
  }

  // Get Alasan Kehadiran Tak Cukup Jam
  getSenaraiAlasanByTakCukupJam() {
    return new Promise<object>((resolve) => {
      const KehadiranTakHadir = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ReasonKehadiran WHERE alas_jenis = "xjam" ORDER BY alas_catatan ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                KehadiranTakHadir.push({
                  id: data.rows.item(i).id,
                  alas_id: data.rows.item(i).alas_id,
                  alas_jenis: data.rows.item(i).alas_jenis,
                  alas_catatan: data.rows.item(i).alas_catatan,
                  alas_mohon: data.rows.item(i).alas_mohon,
                });
              }
              resolve(KehadiranTakHadir);
            })
            .catch(e => console.log(e));
        });
    });
  }

  // Get Alasan Kehadiran Tak Hadir
  getSenaraiAlasanByTakHadir() {
    return new Promise<object>((resolve) => {
      const KehadiranTakHadir = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ReasonKehadiran WHERE alas_jenis = "xhdr" ORDER BY alas_catatan ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                KehadiranTakHadir.push({
                  id: data.rows.item(i).id,
                  alas_id: data.rows.item(i).alas_id,
                  alas_jenis: data.rows.item(i).alas_jenis,
                  alas_catatan: data.rows.item(i).alas_catatan,
                  alas_mohon: data.rows.item(i).alas_mohon,
                });
              }
              resolve(KehadiranTakHadir);
            })
            .catch(e => console.log(e));
        });
    });
  }

    // Get Alasan Kehadiran Tak Lengkap
    getSenaraiAlasanByTakLengkap() {
      return new Promise<object>((resolve) => {
        const KehadiranTakHadir = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM ReasonKehadiran WHERE alas_jenis = "xlgkp" ORDER BY alas_catatan ASC', [])
              .then((data) => {
                for (let i = 0; i < data.rows.length; i++) {
                  KehadiranTakHadir.push({
                    id: data.rows.item(i).id,
                    alas_id: data.rows.item(i).alas_id,
                    alas_jenis: data.rows.item(i).alas_jenis,
                    alas_catatan: data.rows.item(i).alas_catatan,
                    alas_mohon: data.rows.item(i).alas_mohon,
                  });
                }
                resolve(KehadiranTakHadir);
              })
              .catch(e => console.log(e));
          });
      });
    }

  getCode(Type) {
    return new Promise<object>((resolve) => {
      const code = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from KodAlasan where alasan_ring = ?', [Type])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                code.push({
                  id: data.rows.item(i).id,
                  alasanId: data.rows.item(i).alasan_id,
                  alasanDesc: data.rows.item(i).alasan_desc,
                  alasanRing: data.rows.item(i).alasan_ring,
                });
              }
              resolve(code);
            })
            .catch(e => console.log(e));
        });
    });
  }

        // get personal info
  getPersonalInfo() {
    return new Promise<object>((resolve) => {
      const personaldata = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM personal', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                personaldata.push({
                  id: data.rows.item(i).id,
                  staffId: data.rows.item(i).staffId,
                  staffName: data.rows.item(i).staffName,
                  icNumber: data.rows.item(i).icNumber,
                  email: data.rows.item(i).email,
                  grade: data.rows.item(i).grade,
                  jawatan: data.rows.item(i).jawatan,
                  role: data.rows.item(i).role,
                  pelulusID: data.rows.item(i).pelulusId,
                });
              }
              resolve( personaldata );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get total course info
  getTotalCourse() {
    return new Promise<object>((resolve) => {
      const totalcourse = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT SUM(days) AS totalKursus FROM totalcourse', [])
            .then((res) => {
              if (res.rows.length > 0) {
                const totalKursus = parseInt(res.rows.item(0).totalKursus);
                this.totalcourse = totalKursus;
              }
              totalcourse.push({
                total: this.totalcourse
              });
              resolve( totalcourse );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get card colour
  getColour() {
    return new Promise<object>((resolve) => {
      const cardcolor = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM cardcolor where id = 1', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                cardcolor.push({
                  staffId: data.rows.item(i).staffId,
                  date: data.rows.item(i).date,
                  remark: data.rows.item(i).remark,
                  supervisor: data.rows.item(i).supervisor,
                  status: data.rows.item(i).status,
                  color: data.rows.item(i).color,
                  bilLewat: data.rows.item(i).bilLewat,
                  timeUpdate: data.rows.item(i).timeUpdate,
                });
              }
              resolve( cardcolor );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get waktukerja
  getWaktuKerja() {
    return new Promise<object>((resolve) => {
      const workhour = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM workhour', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                workhour.push({
                  shiftUserId: data.rows.item(i).shiftUserId,
                  shiftFrom: data.rows.item(i).shiftFrom,
                  shiftEnd: data.rows.item(i).shiftEnd,
                  shiftCode: data.rows.item(i).shiftCode,
                  startTime: data.rows.item(i).startTime,
                  endTime: data.rows.item(i).endTime,
                  jamKerja: data.rows.item(i).jamKerja,
                });
              }
              resolve( workhour );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get waktu masuk
  getTimeIn() {
    return new Promise<object>((resolve) => {
      const timein = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM timeInOut WHERE codeDesc = "Masuk" AND attendanceCode = "1" LIMIT 1', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                timein.push({
                  thisDate: data.rows.item(i).thisDate,
                  thisTime: data.rows.item(i).thisTime,
                  codeDesc: data.rows.item(i).codeDesc,
                  attendanceCode: data.rows.item(i).attendanceCode,
                  thisTimeOut: data.rows.item(i).thisTimeOut,
                });
              }
              resolve( timein );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get waktu keluar
  getTimeOut() {
    return new Promise<object>((resolve) => {
      const timeout = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM timeInOut WHERE codeDesc = "Keluar" AND attendanceCode = "0" LIMIT 1', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                timeout.push({
                  thisDate: data.rows.item(i).thisDate,
                  thisTime: data.rows.item(i).thisTime,
                  codeDesc: data.rows.item(i).codeDesc,
                  attendanceCode: data.rows.item(i).attendanceCode,
                  thisTimeOut: data.rows.item(i).thisTimeOut,
                });
              }
              resolve( timeout );
            })
            .catch(e => console.log(e));
        });
    });
  }


  // get status reader
  getStatusReader() {
    return new Promise<object>((resolve) => {
      const statreader = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM statusreader WHERE doorId IN (48, 49, 50, 51, 52, 53, 54, 55, 143) LIMIT 9', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                statreader.push({
                  readerstatId: data.rows.item(i).readerstatId,
                  doorDesc: data.rows.item(i).doorDesc,
                  readerstatStatus: data.rows.item(i).readerstatStatus,
                  readerstatDatetime: data.rows.item(i).readerstatDatetime,
                  timeCheck: data.rows.item(i).timeCheck,
                  lasttimeCheck: data.rows.item(i).lasttimeCheck,
                  doorId: data.rows.item(i).doorId,
                  doorIpaddr: data.rows.item(i).doorIpaddr,
                  readertypeDesc: data.rows.item(i).readertypeDesc,
                });
              }
              resolve( statreader );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // get totalleave
  getLeave() {
    return new Promise<object>((resolve) => {
      const totalleave = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT SUM(numOfDays) AS totalcuti FROM totalleave', [])
            .then((res) => {
              if (res.rows.length > 0) {
                const totalcuti = parseInt(res.rows.item(0).totalcuti);
                this.totalleave = totalcuti;
              }
              totalleave.push({
                total: this.totalleave
              });
              resolve( totalleave );
            })
            .catch(e => console.log(e));
        });
    });
  }

  // total record of approval list for userdashboard
  getTotalNumberOfAlasanApproval() {
    return new Promise<object>((resolve) => {
      const details = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from reasonapproval where status = 0', [])
            .then((data) => {
              details.push({
                total: data.rows.length
              });
              resolve( details );
            })
            .catch(e => console.log(e));
        });
    });
  }



    // total record of lulus tugas luar/ Tugas Luar
    getTotalNumberOfLulusTugasLuar() {
      return new Promise<object>((resolve) => {
        const details = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('select * from TugasLuar where eakur_status = 0', [])
              .then((data) => {
                details.push({
                  total: data.rows.length
                });
                resolve( details );
              })
              .catch(e => console.log(e));
          });
      });
    }


     // total record of courses
     getTotalNumberOfCourse() {
      return new Promise<object>((resolve) => {
        const details = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('select * from totalcourse', [])
              .then((data) => {
                details.push({
                  total: data.rows.length
                });
                resolve( details );
              })
              .catch(e => console.log(e));
          });
      });
    }


     // total record of courses
    getTotalNumberOfKehadiran() {
      return new Promise<object>((resolve) => {
        const details = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            const today = new Date();
            const todayA = today.toLocaleString('fr-BE');
            const splittodayA = todayA.split('/');

            const splitYear = splittodayA[2].substring(0, 4);
            let splitMonth = splittodayA[1];
            let splitDay = splittodayA[0];
            if (splitMonth.length === 1) { splitMonth = '0' + splitMonth; }
            if (splitDay.length === 1) { splitDay = '0' + splitDay; }
            const dateToday = splitYear  + '-' + splitMonth   + '-' + splitDay;

            db.executeSql('select * from kemasukanalasan WHERE date NOT IN ("' + dateToday + '") and status = 0', [])
              .then((data) => {
                details.push({
                  total: data.rows.length
                });
                resolve( details );
              })
              .catch(e => console.log(e));
          });
      });
    }



     // total record of Leave
     getTotalNumberOfLeave() {
      return new Promise<object>((resolve) => {
        const details = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('Select * from totalleave ', [])
              .then((data) => {
                details.push({
                  total: data.rows.length
                });
                resolve( details );
              })
              .catch(e => console.log(e));
          });
      });
    }

        // get data leave modul
        getLeaveDetails() {
          return new Promise<object>((resolve) => {
            const leavedata = [];
            this.initDB()
              .then((db: SQLiteObject) => {
                db.executeSql('Select Leave.id, ealv_staffid, ealv_leavecode, eaal_leavekod, eaal_leavedesc,ealv_startdate,ealv_enddate,ealv_noofdays,ealv_remark from Leave join LeaveCode on eaal_leavekod=ealv_leavecode', [])
                  .then((data) => {
                    for (let i = 0; i < data.rows.length; i++) {
                      leavedata.push({
                        id: data.rows.item(i).id,
                        StaffID: data.rows.item(i).ealv_staffid,
                        StartDate: data.rows.item(i).ealv_startdate,
                        EndDate: data.rows.item(i).ealv_enddate,
                        NoOfDay: data.rows.item(i).ealv_noofdays,
                        LeaveCode: data.rows.item(i).ealv_leavecode,
                        ApplyDateTime: data.rows.item(i).ealv_applydatetime ,
                        Approval: data.rows.item(i).ealv_approval,
                        ApplyStaffId: data.rows.item(i).ealv_applystaffid,
                        Remark: data.rows.item(i).ealv_remark,
                        descCode: data.rows.item(i).eaal_leavedesc,
                      });
                    }
                    resolve(leavedata);
                  })
                  .catch(e => console.log(e));
              });
          });
        }


   // Get Leave Code
          getLeaveCode(CodeID) {
            return new Promise<object>((resolve) => {
              const leaveCode = [];
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('Select * from LeaveCode where eaal_leavekod = ?', [CodeID])
                    .then((data) => {
                      for (let i = 0; i < data.rows.length; i++) {
                        leaveCode.push({
                          LeaveCode: data.rows.item(i).eaal_leavekod,
                          LeaveDesc: data.rows.item(i).eaal_leavedesc,
                        });
                      }
                      resolve(leaveCode);
                    })
                    .catch(e => console.log(e));
                });
            });
          }

          // List Jenis Cuti
          getListJenisCuti() {
            return new Promise<object>((resolve) => {
              const listcuti = [];
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('Select * from LeaveCode', [])
                    .then((data) => {
                      for (let i = 0; i < data.rows.length; i++) {
                        listcuti.push({
                          eaal_leavekod: data.rows.item(i).eaal_leavekod,
                          eaal_leavedesc: data.rows.item(i).eaal_leavedesc,
                        });
                      }
                      resolve(listcuti);
                    })
                    .catch(e => console.log(e));
                });
            });
          }


          // Get Leave Code
          getCodeKursus(CodeID) {
            return new Promise<object>((resolve) => {
              const CourseCode = [];
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('Select * from CodeKursus where eaal_outkod = ?', [CodeID])
                    .then((data) => {
                      for (let i = 0; i < data.rows.length; i++) {
                        CourseCode.push({
                          CoursesCode: data.rows.item(i).eaal_outkod,
                          CoursesDesc: data.rows.item(i).eaal_outdesc,
                        });
                      }
                      resolve(CourseCode);
                    })
                    .catch(e => console.log(e));
                });
            });
          }

          // get List Tugas Luar
          getListJenisTugasLuar() {
            return new Promise<object>((resolve) => {
              const CourseCode = [];
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('Select * from CodeKursus', [])
                    .then((data) => {
                      for (let i = 0; i < data.rows.length; i++) {
                        CourseCode.push({
                          KursusKod: data.rows.item(i).eaal_outkod,
                          KursusDesc: data.rows.item(i).eaal_outdesc,
                        });
                      }
                      resolve(CourseCode);
                    })
                    .catch(e => console.log(e));
                });
            });
          }

       // Get single Leave details
        getDetailsLeave(id) {
          return new Promise<object>((resolve) => {
            const details = [];
            this.initDB()
              .then((db: SQLiteObject) => {
                db.executeSql('Select * from Leave where id = ?', [id])
                  .then((data) => {
                    for (let i = 0; i < data.rows.length; i++) {
                      details.push({
                        id: data.rows.item(i).id,
                        StaffID: data.rows.item(i).ealv_staffid,
                        StartDate: data.rows.item(i).ealv_startdate,
                        EndDate: data.rows.item(i).ealv_enddate,
                        NoOfDay: data.rows.item(i).ealv_noofdays,
                        LeaveCode: data.rows.item(i).ealv_leavecode,
                        ApplyDateTime: data.rows.item(i).ealv_applydatetime ,
                        Approval: data.rows.item(i).ealv_approval,
                        ApplyStaffId: data.rows.item(i).ealv_applystaffid,
                        Remark: data.rows.item(i).ealv_remark,
                      });
                  }
                    resolve( details );
                  })
                  .catch(e => console.log(e));
              });
          });
        }

          // Update leave
          updateUserLeave(leave: any) {
            console.log(JSON.stringify(leave));
            return new Promise<object>((resolve) => {
              const data = [leave.StaffID, leave.StartDate, leave.EndDate, leave.NoOfDay, leave.LeaveCode,
                            leave.ApplyDateTime, leave.Approval, leave.ApplyStaffId, leave.Remark];
              this.initDB()
                .then((db: SQLiteObject) => {
                  console.log('begin update leave');
                  db.executeSql(`UPDATE leave SET ealv_staffid = ?, ealv_startdate = ?, ealv_enddate = ?, \
                          ealv_noofdays = ?, ealv_leavecode = ?,  ealv_applydatetime = ?,  ealv_approval = ?, \
                          ealv_applystaffid = ?,  ealv_remark = ? WHERE id = ${1}`, data)
                          .then(() => {
                    }).catch(e => console.log(JSON.stringify(e) + ' this is error'));
                })
                .catch(e => console.log(JSON.stringify(e) + ' this is error'));
            });
          }

            // insert new application leave
            insertmyapplication(leave: any) {
              const StaffID = leave.ealv_staffid;
              const startDate = leave.ealv_startdate;
              const endDate =  leave.ealv_enddate;
              const NoOfDay = leave.ealv_noofdays;
              const LeaveCode = leave.ealv_leavecode;
              const ApplyDateTime = leave.ealv_applydatetime;
              const Approval = leave.ealv_approval;
              const ApplyStaffId = leave.ealv_applystaffid;
              const Remark = leave.ealv_remark;
              this.initDB()
              .then((db: SQLiteObject) => {
                console.log('begin insert new apply Leave');
                db.executeSql('INSERT INTO Leave \
              (ealv_staffid, \
                ealv_startdate, \
                ealv_enddate, \
                ealv_noofdays, \
                ealv_leavecode, \
                ealv_applydatetime, \
                ealv_approval, \
                ealv_applystaffid,\
                ealv_remark) \
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [StaffID, startDate, endDate, NoOfDay, LeaveCode, ApplyDateTime, Approval, ApplyStaffId, Remark]);
                },
              err => console.error(err));
          }
            // delete leave by id
              deleteLeave(id) {
                return new Promise<object>(() => {
                  this.initDB()
                    .then((db: SQLiteObject) => {
                      db.executeSql('DELETE FROM Leave where id = ?', [id])
                        .then(() => {})
                        .catch(e => console.log(e));
                    });
                });
              }





   // Get Leave details
    getTugasLuar() {
      return new Promise<object>((resolve) => {
        const CourseData = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('Select * from TugasLuar where eakur_id IS NOT NULL', [])
              .then((data) => {
                for (let i = 0; i < data.rows.length; i++) {
                  CourseData.push({
                    id: data.rows.item(i).id,
                    CourseID: data.rows.item(i).eakur_id,
                    StaffID: data.rows.item(i). eakur_staffid,
                    HourCourses: data.rows.item(i).eaal_hour,
                    TarikhMula: data.rows.item(i).tkh_mula,
                    TarikhTamat: data.rows.item(i).tkh_tamat,
                    TimeMula: data.rows.item(i).time_mula,
                    TimeTamat: data.rows.item(i).time_tamat,
                    NumOfDay: data.rows.item(i).eakur_noday,
                    BilJam: data.rows.item(i).eakur_biljam,
                    KurStart: data.rows.item(i).eakur_start,
                    KurApply: data.rows.item(i).eakur_apply,
                    KurName: data.rows.item(i).eakur_name,
                    Status: data.rows.item(i).eakur_status,
                    KurAnjuran: data.rows.item(i).eakur_anjuran,
                    KurLocation: data.rows.item(i).eakur_location,
                    ApprovedID: data.rows.item(i).eakur_approved_id,
                    KurApproveBy: data.rows.item(i).eakur_approveby,
                    KurApproveBy2: data.rows.item(i).eakur_approveby2,
                    KurApproveDate: data.rows.item(i).eakur_appdate,
                    KurOutKod: data.rows.item(i).eakur_outkod,
                    kurDesc: data.rows.item(i).eaal_outdesc,
                    KurStaffName: data.rows.item(i).easf_staffname,
                    KurCard: data.rows.item(i).easf_cardtype,
                    KurNamaPegang: data.rows.item(i).easf_namapegang,
                  });
                }
                resolve(CourseData);
              })
              .catch(e => console.log(e));
          });
      });
    }

     // Get single Leave details
     getTugasLuarDetails(id) {
      return new Promise<object>((resolve) => {
        const kurluarlist = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('Select * from TugasLuar where id = ?', [id])
              .then((data) => {
                for (let i = 0; i < data.rows.length; i++) {
                  kurluarlist.push({
                    id: data.rows.item(i).id,
                    CourseID: data.rows.item(i).eakur_id,
                    StaffID: data.rows.item(i). eakur_staffid,
                    HourCourses: data.rows.item(i).eaal_hour,
                    TarikhMula: data.rows.item(i).tkh_mula,
                    TarikhTamat: data.rows.item(i).tkh_tamat,
                    TimeMula: data.rows.item(i).time_mula,
                    TimeTamat: data.rows.item(i).time_tamat,
                    NumOfDay: data.rows.item(i).eakur_noday,
                    BilJam: data.rows.item(i).eakur_biljam,
                    KurStart: data.rows.item(i).eakur_start,
                    KurApply: data.rows.item(i).eakur_apply,
                    KurName: data.rows.item(i).eakur_name,
                    Status: data.rows.item(i).eakur_status,
                    KurAnjuran: data.rows.item(i).eakur_anjuran,
                    KurLocation: data.rows.item(i).eakur_location,
                    KurApproveBy: data.rows.item(i).eakur_approveby,
                    KurApproveBy2: data.rows.item(i).eakur_approveby2,
                    KurApproveDate: data.rows.item(i).eakur_appdate,
                    KurOutKod: data.rows.item(i).eakur_outkod,
                    kurDesc: data.rows.item(i).eaal_outdesc,
                    KurStaffName: data.rows.item(i).easf_staffname,
                    KurCard: data.rows.item(i).easf_cardtype,
                    KurNamaPegang: data.rows.item(i).easf_namapegang,
                  });
                }
                resolve(kurluarlist);
              })
              .catch(e => console.log(e));
          });
      });
    }


      // Lulus Tugas Luar
      StatusLulusTugas(TugasLuar: any) {
        return new Promise<object>((resolve) => {
          const data = [TugasLuar.eakur_appdate, TugasLuar.eakur_approveby, TugasLuar.eaal_hour,
            TugasLuar.eakur_id, TugasLuar.eakur_status];
          this.initDB()
            .then((db: SQLiteObject) => {
              db.executeSql(`UPDATE TugasLuar SET eakur_appdate = ?, eakur_approveby = ?, eaal_hour = ?, eakur_id = ?,  eakur_status = ? WHERE id = ${1}`, data)
                .then((response) => {
                  resolve(response);
                }).catch(e => console.log(JSON.stringify(e) + ' this is error'));
            })
            .catch(e => console.log(JSON.stringify(e) + ' this is error'));
        });
      }

      // Get Senarai Tugas Luar
      getSenaraiTugasLuar() {
        return new Promise<object>((resolve) => {
          const CourseData = [];
          this.initDB()
            .then((db: SQLiteObject) => {
              db.executeSql('Select * from SenaraiTugas ORDER BY eakur_start DESC', [])
                .then((data) => {
                  for (let i = 0; i < data.rows.length; i++) {
                    CourseData.push({
                      id: data.rows.item(i).id,
                      CourseID: data.rows.item(i).eakur_id,
                      StaffID: data.rows.item(i).eakur_staffid,
                      StaffName: data.rows.item(i).easf_staffname,
                      CourseName: data.rows.item(i).eakur_name,
                      KurLocation: data.rows.item(i).eakur_location,
                      KurMula: data.rows.item(i).kur_mula,
                      KurTamat: data.rows.item(i).kur_tmt,
                      KurStart: data.rows.item(i).eakur_start,
                      KurEnd: data.rows.item(i).eakur_end,
                      KurCode: data.rows.item(i).eakur_outkod,
                      KurAnjuran: data.rows.item(i).eakur_anjuran,
                      kurNoDays: data.rows.item(i).eakur_noday,
                      Kehadiran: data.rows.item(i).eakur_kehadir,
                      Wakil: data.rows.item(i).eakur_wakil,
                      Doc: data.rows.item(i).eakur_doc,
                      TimeStart: data.rows.item(i).eakur_timestart,
                      TimeEnd: data.rows.item(i).eakur_timeend,
                      KurApply: data.rows.item(i).eakur_apply,
                      KurRujukan: data.rows.item(i).eakur_rujukan,
                      KurMulaHour: data.rows.item(i).kursus_mula,
                      KurEndHour: data.rows.item(i).kursus_end,
                      Bil_Jam: data.rows.item(i).eakur_biljam,
                      Status: data.rows.item(i).eakur_status,
                      ApproveBy: data.rows.item(i).eakur_approveby,
                      Pelulus: data.rows.item(i).pelulus,
                    });
                  }
                  resolve(CourseData);
                })
                .catch(e => console.log(e));
            });
        });
      }

           // Get Senarai Tugas Luar By ID
          getSenaraiTugasLuarDetails(id) {
            return new Promise<object>((resolve) => {
              const CourseData = [];
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('Select * from SenaraiTugas where id = ?', [id])
                    .then((data) => {
                      for (let i = 0; i < data.rows.length; i++) {
                        CourseData.push({
                          id: data.rows.item(i).id,
                          CourseID: data.rows.item(i).eakur_id,
                          StaffID: data.rows.item(i).eakur_staffid,
                          StaffName: data.rows.item(i).easf_staffname,
                          CourseName: data.rows.item(i).eakur_name,
                          KurLocation: data.rows.item(i).eakur_location,
                          KurMula: data.rows.item(i).kur_mula,
                          KurTamat: data.rows.item(i).kur_tmt,
                          KurStart: data.rows.item(i).eakur_start,
                          KurEnd: data.rows.item(i).eakur_end,
                          KurCode: data.rows.item(i).eakur_outkod,
                          KurAnjuran: data.rows.item(i).eakur_anjuran,
                          KurNoDays: data.rows.item(i).eakur_noday,
                          Kehadiran: data.rows.item(i).eakur_kehadir,
                          Wakil: data.rows.item(i).eakur_wakil,
                          Doc: data.rows.item(i).eakur_doc,
                          TimeStart: data.rows.item(i).eakur_timestart,
                          TimeEnd: data.rows.item(i).eakur_timeend,
                          KurApply: data.rows.item(i).eakur_apply,
                          KurRujukan: data.rows.item(i).eakur_rujukan,
                          KurMulaHour: data.rows.item(i).kursus_mula,
                          KurEndHour: data.rows.item(i).kursus_end,
                          Bil_Jam: data.rows.item(i).eakur_biljam,
                          Status: data.rows.item(i).eakur_status,
                          ApproveBy: data.rows.item(i).eakur_approveby,
                          Pelulus: data.rows.item(i).pelulus,
                        });
                      }
                      resolve(CourseData);
                    })
                    .catch(e => console.log(e));
                });
            });
          }

          // delete leave by id
          deleteCourses(id) {
            return new Promise<object>(() => {
              this.initDB()
                .then((db: SQLiteObject) => {
                  db.executeSql('DELETE FROM SenaraiTugas where id = ?', [id])
                    .then(() => {})
                    .catch(e => console.log(e));
                });
            });

          }


      // Lulus Tugas Luar
      UpdateCourses(Courses: any) {
        return new Promise<object>((resolve) => {
          const data = [Courses.eakur_start, Courses.eakur_end, Courses.eakur_noday, Courses.eakur_outkod, Courses.eakur_timestart,
          Courses.eakur_timeend, Courses.eakur_apply, Courses.eakur_name, Courses.eakur_anjuran, Courses.eakur_location,
          Courses.eakur_rujukan, Courses.eakur_biljam, Courses.eakur_status];
          this.initDB()
            .then((db: SQLiteObject) => {
              db.executeSql(`UPDATE SenaraiTugas SET eakur_start = ?, eakur_end = ?, eakur_noday = ?, eakur_outkod = ?,  eakur_timestart = ? ,\
              eakur_timeend = ?, eakur_apply = ?, eakur_name = ?, eakur_anjuran = ?, eakur_location = ?,
              eakur_rujukan = ?, eakur_biljam = ?, eakur_status = ? WHERE id = ${1}`, data)
                .then((response) => {
                  resolve(response);
                }).catch(e => console.log(JSON.stringify(e) + ' this is error'));
            })
            .catch(e => console.log(JSON.stringify(e) + ' this is error'));
        });
      }
      // Insert Permohonan Courses
      InsertCourses(Courses: any) {
        console.log('aaaaaa' + JSON.stringify(Courses));
        const CoursesID = Courses.eakur_id;
        const StaffID = Courses.eakur_staffid;
        const StaffName = Courses.easf_staffname;
        const KurName = Courses.eakur_name;
        const KurLocation = Courses.eakur_location;
        const KurMulaDate = Courses.kur_mula;
        const KurTamatDate = Courses.kur_tmt;
        const KurStartDate = Courses.eakur_start;
        const KurEndDate = Courses.eakur_end;
        const KurOutKod = Courses.eakur_outkod;
        const KurAnjuran = Courses.eakur_anjuran;
        const Kehadiran = Courses.eakur_kehadir;
        const Wakil  = Courses.eakur_wakil;
        const Doc = Courses.eakur_doc;
        const Kurnoday = Courses.eakur_noday;
        const KurTimeStart = Courses.eakur_timestart;
        const KurTimeEnd = Courses.eakur_timeend;
        const KurApply = Courses.eakur_apply;
        const KurRujukan = Courses.eakur_rujukan;
        const KurMula = Courses.kursus_mula;
        const KurEnd = Courses.kursus_end;
        const BilJam = Courses.eakur_biljam;
        const Status = Courses.status;
        const ApprovedBy = Courses.eakur_approveby;
        const Pelulus = Courses.pelulus;

        this.initDB()
                  .then((db: SQLiteObject) => {
                    console.log('begin insert Senarai Tugas');
                    db.executeSql('INSERT INTO SenaraiTugas \
                  (eakur_id, \
                    eakur_staffid, \
                    easf_staffname, \
                    eakur_name, \
                    eakur_location, \
                    kur_mula, \
                    kur_tmt,\
                    eakur_start,\
                    eakur_end,\
                    eakur_outkod,\
                    eakur_anjuran, \
                    eakur_kehadir, \
                    eakur_wakil, \
                    eakur_doc, \
                    eakur_noday, \
                    eakur_timestart,\
                    eakur_timeend, \
                    eakur_apply, \
                    eakur_rujukan, \
                    kursus_mula, \
                    kursus_end, \
                    eakur_biljam, \
                    eakur_status, \
                    eakur_approveby, \
                    pelulus)\
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [CoursesID, StaffID, StaffName, KurName, KurLocation, KurMulaDate, KurTamatDate, KurStartDate, KurEndDate,
                   KurOutKod, KurAnjuran, Kehadiran, Wakil, Doc, Kurnoday, KurTimeStart, KurTimeEnd, KurApply, KurRujukan,
                   KurMula, KurEnd, BilJam, Status, ApprovedBy, Pelulus]);
                    },
                  err => console.error(err));
      }



      InsertReasonForApproval(reason: any) {
        for (const element of reason) {
          const dateYmd = element.ealt_date;
          const a = dateYmd.split('-');
          const year = a[0];
          const month = a[1];
          const day = a[2];
          const dateNew = year + month + day;
          this.initDB()
                  .then((db: SQLiteObject) => {
                    console.log('begin insert reasonapproval');
                    db.executeSql('INSERT INTO reasonapproval \
                  (ealt_staffid, \
                    easf_staffname, \
                    ealt_latetime, \
                    ealt_latecode, \
                    tkh_alasan, \
                    ealt_date, \
                    ealt_remark, \
                    time_alasan,\
                    easc_greddesc,\
                    easc_jawatandesc,\
                    cawang_desc,\
                    jab_desc,\
                    alasan_desc,\
                    easf_namapegang,\
                    easf_cardtype,\
                    check_in,\
                    check_out,\
                    jamkerja,\
                    status,\
                    date, \
                    ealt_supervisor,\
                    ealt_supervisor2,\
                    ealt_status,\
                    ealt_catit, \
                    ealt_pelulus,\
                    ealt_lulusdtime,\
                    ealt_autoinsert,\
                    ealt_insertdtime,\
                    ealt_timeout,\
                    ealt_timein,\
                    ealt_jamkerja) \
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )',
                      [element.ealt_staffid,
                        element.easf_staffname,
                        element.ealt_latetime,
                        element.ealt_latecode,
                        element.tkh_alasan,
                        element.ealt_date,
                        element.ealt_remark,
                        element.time_alasan,
                        element.easc_greddesc,
                        element.easc_jawatandesc,
                        element.cawang_desc,
                        element.jab_desc,
                        element.alasan_desc,
                        element.easf_namapegang,
                        element.easf_cardtype,
                        element.check_in,
                        element.check_out,
                        element.jamkerja,
                        0, dateNew,
                        element.ealt_supervisor,
                        element.ealt_supervisor2,
                        element.ealt_status,
                        element.ealt_catit,
                        element.ealt_pelulus,
                        element.ealt_lulusdtime,
                        element.autoinsert,
                        element.ealt_insertdtime,
                        element.ealt_timeout,
                        element.ealt_timein,
                        element.ealt_jamkerja,
                      ]);
                  }, err => console.error(err));
              }
        }




  // get list reason for approval
  getListofReasonForApproval() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from reasonapproval where status = 0 ORDER BY ealt_date DESC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  ealt_staffid: data.rows.item(i).ealt_staffid,
                  easf_staffname: data.rows.item(i).easf_staffname,
                  ealt_latetime: data.rows.item(i).ealt_latetime,
                  ealt_latecode: data.rows.item(i).ealt_latecode,
                  tkh_alasan: data.rows.item(i).tkh_alasan,
                  ealt_date: data.rows.item(i).ealt_date ,
                  ealt_remark: data.rows.item(i).ealt_remark,
                  time_alasan: data.rows.item(i).time_alasan,
                  easc_greddesc: data.rows.item(i).easc_greddesc,
                  easc_jawatandesc: data.rows.item(i).easc_jawatandesc,
                  cawang_desc: data.rows.item(i).cawang_desc,
                  jab_desc: data.rows.item(i).jab_desc,
                  alasan_desc: data.rows.item(i).alasan_desc,
                  easf_namapegang: data.rows.item(i).easf_namapegang,
                  easf_cardtype: data.rows.item(i).easf_cardtype,
                  check_in: data.rows.item(i).check_in,
                  check_out: data.rows.item(i).check_out,
                  jamkerja: data.rows.item(i).jamkerja,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }


  // get list reason for approval by id
  getListReasonForApprovalbyId(id) {
    return new Promise<object>((resolve) => {
      const details = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('Select * from reasonapproval where id = ?', [id])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                details.push({
                  id: data.rows.item(i).id,
                  ealt_staffid: data.rows.item(i).ealt_staffid,
                  easf_staffname: data.rows.item(i).easf_staffname,
                  ealt_latetime: data.rows.item(i).ealt_latetime,
                  ealt_latecode: data.rows.item(i).ealt_latecode,
                  tkh_alasan: data.rows.item(i).tkh_alasan,
                  ealt_date: data.rows.item(i).ealt_date ,
                  ealt_remark: data.rows.item(i).ealt_remark,
                  time_alasan: data.rows.item(i).time_alasan,
                  easc_greddesc: data.rows.item(i).easc_greddesc,
                  easc_jawatandesc: data.rows.item(i).easc_jawatandesc,
                  cawang_desc: data.rows.item(i).cawang_desc,
                  jab_desc: data.rows.item(i).jab_desc,
                  alasan_desc: data.rows.item(i).alasan_desc,
                  easf_namapegang: data.rows.item(i).easf_namapegang,
                  easf_cardtype: data.rows.item(i).easf_cardtype,
                  check_in: data.rows.item(i).check_in,
                  check_out: data.rows.item(i).check_out,
                  jamkerja: data.rows.item(i).jamkerja,
                });
            }
              resolve( details );
            })
            .catch(e => console.log(e));
        });
    });
  }


  // update lulus alasan oleh pelulus
  pelulusUpdateReasonList(dataApproval: any) {
    return new Promise<object>((resolve) => {
      const tarikh = new Date();
      const data = [tarikh, dataApproval.pelulusId, dataApproval.catitan, dataApproval.status, dataApproval.id];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql(`UPDATE reasonapproval SET lulus_time = ?, pelulus_id = ?, catitan = ?, status = ?\
          WHERE id = ?`, data)
            .then((response) => {
              resolve(response);
            }).catch(e => console.log(JSON.stringify(e) + ' this is error'));
        })
        .catch(e => console.log(JSON.stringify(e) + ' this is error'));
    });
  }

  getListKemasukanAlasanTH() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceuser ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  time_in: data.rows.item(i).time_in,
                  time_out: data.rows.item(i).time_out,
                  total_work: data.rows.item(i).total_work,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getListKemasukanAlasanTL() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceuser where (time_in IS NULL or time_out IS NULL) ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  time_in: data.rows.item(i).time_in,
                  time_out: data.rows.item(i).time_out,
                  total_work: data.rows.item(i).total_work,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getTimeInTimeOut(diff) {
      return new Promise<object>((resolve) => {
        const reason = [];
        this.initDB()
          .then((db: SQLiteObject) => {
            db.executeSql('select * from attendanceuser where date in (' + diff + ') ORDER BY date ASC', [])
              .then((data) => {
                for (let i = 0; i < data.rows.length; i++) {
                  reason.push({
                    id: data.rows.item(i).id,
                    date: data.rows.item(i).date,
                    time_in: data.rows.item(i).time_in,
                    time_out: data.rows.item(i).time_out,
                    total_work: data.rows.item(i).total_work,
                  });
                }
                resolve(reason);
              })
              .catch(e => console.log(e));
          });
      });
  }

  getAttendanceLateWithKIV() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendancelateKIV ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  ealt_status: data.rows.item(i).ealt_status,
                  ealt_catit: data.rows.item(i).ealt_catit,
                  ealt_timein: data.rows.item(i).ealt_timein,
                  ealt_timeout: data.rows.item(i).ealt_timeout,
                  ealt_jamkerja: data.rows.item(i).ealt_jamkerja,
                  latecode: data.rows.item(i).latecode,
                  alasan_desc: data.rows.item(i).alasan_desc
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
}

  getListAttendanceReasonAll() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendancelate ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  ealt_status: data.rows.item(i).ealt_status,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }
  getListAttendanceReason() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendancelate where ealt_status=1 ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  ealt_status: data.rows.item(i).ealt_status,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }
  getListCuti() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceleave ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }
  getPH() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from publicholiday ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }
  getModulLuar() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendancetugasluar ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getListTakCukupJam() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceuser where total_work < "09:00" ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  time_in: data.rows.item(i).time_in,
                  time_out: data.rows.item(i).time_out,
                  total_work: data.rows.item(i).total_work,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }



  getListHadirLewat() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceuser where time_in > "09:00" ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  time_in: data.rows.item(i).time_in,
                  time_out: data.rows.item(i).time_out,
                  total_work: data.rows.item(i).total_work,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getListKeluarAwal() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from attendanceuser where time_out < "04:30" ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  time_in: data.rows.item(i).time_in,
                  time_out: data.rows.item(i).time_out,
                  total_work: data.rows.item(i).total_work,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getListKemasukanAlasanLatestByID(id) {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('select * from kemasukanalasan WHERE id = ? ', [id])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                reason.push({
                  id: data.rows.item(i).id,
                  date: data.rows.item(i).date,
                  jenis_kehadiran: data.rows.item(i).jenis_kehadiran,
                  jenis_kehadiran_desc: data.rows.item(i).jenis_kehadiran_desc,
                  alasan_ring: data.rows.item(i).alasan_ring,
                  masuk: data.rows.item(i).masuk,
                  keluar: data.rows.item(i).keluar,
                  jamkerja: data.rows.item(i).jamkerja,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  getListKemasukanAlasanLatest() {
    return new Promise<object>((resolve) => {
      const reason = [];
      this.initDB()
        .then((db: SQLiteObject) => {
          const today = new Date();
          const todayA = today.toLocaleString('fr-BE');
          const splittodayA = todayA.split('/');

          const splitYear = splittodayA[2].substring(0, 4);
          let splitMonth = splittodayA[1];
          let splitDay = splittodayA[0];
          if (splitMonth.length === 1) { splitMonth = '0' + splitMonth; }
          if (splitDay.length === 1) { splitDay = '0' + splitDay; }
          const dateToday = splitYear  + '-' + splitMonth   + '-' + splitDay;

          db.executeSql('select * from kemasukanalasan WHERE date NOT IN ("' + dateToday + '") and status=0 ORDER BY date ASC', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                const dateFormat = data.rows.item(i).date;
                const split = dateFormat.split('-');
                const dateFormatNew = split[2]  + '-' + split[1]   + '-' + split[0];
                reason.push({
                  id: data.rows.item(i).id,
                  date: dateFormatNew,
                  jenis_kehadiran: data.rows.item(i).jenis_kehadiran,
                  jenis_kehadiran_desc: data.rows.item(i).jenis_kehadiran_desc,
                  alasan_ring: data.rows.item(i).alasan_ring,
                  masuk: data.rows.item(i).masuk,
                  keluar: data.rows.item(i).keluar,
                  jamkerja: data.rows.item(i).jamkerja,
                  ealt_catit: data.rows.item(i).ealt_catit,
                  type: data.rows.item(i).type,
                });
              }
              resolve(reason);
            })
            .catch(e => console.log(e));
        });
    });
  }

  updateKemasukanAlasan(data: any) {
    return new Promise<object>((resolve) => {
      this.initDB()
        .then((db: SQLiteObject) => {
          console.log('begin update kemasukan alasan');
          db.executeSql('UPDATE kemasukanalasan SET status = 1 WHERE id = ' + data.id)
                  .then(() => {
            }).catch(e => console.log(e));
        })
        .catch(e => console.log(JSON.stringify(e) + ' this is error'));
    });
  }

   // get session
  getSessionTime() {
    return new Promise<object>((resolve) => {
      const waktu = [];
      this.initDBSession()
        .then((dbSes: SQLiteObject) => {
          dbSes.executeSql('SELECT * FROM loginsession', [])
            .then((data) => {
              for (let i = 0; i < data.rows.length; i++) {
                waktu.push({
                  id: data.rows.item(i).id,
                  tarikh: data.rows.item(i).tarikh,
                });
              }
              resolve( waktu );
            })
            .catch(e => console.log(e));
        });
    });
  }


  // delete data in database
  deleteTimeInOut() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM timeInOut', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteTotalLeave() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM totalleave', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteTotalCourse() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM totalcourse', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteAlasanKehadiran() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM kemasukanalasan', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteKehadiranIndividu() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM attendanceuser', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteKehadiranLewat() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM attendancelate', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteKehadiranKIV() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM attendancelateKIV', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteCutiUmum() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM publicholiday', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteKehadiranCuti() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM attendanceleave', [])
            .catch(e => console.log(e));
        });
    });
  }

  deleteKehadiranTugasLuar() {
    return new Promise<object>(() => {
      this.initDB()
        .then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM attendancetugasluar', [])
            .catch(e => console.log(e));
        });
    });
  }
}
