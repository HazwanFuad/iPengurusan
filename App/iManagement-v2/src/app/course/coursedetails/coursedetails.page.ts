import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-coursedetails',
  templateUrl: './coursedetails.page.html',
  styleUrls: ['./coursedetails.page.scss'],
})
export class CoursedetailsPage implements OnInit {

  public Coursedetails = {};
  public mycode = {};
  public descCode = {};

  constructor(
    private route: ActivatedRoute,
    private sqlite: SqliteService,
  ) {

  this.getSenaraiTugas();
  this.getListTugas();


  }

  ngOnInit() {
  }

  async getSenaraiTugas() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sqlite.getSenaraiTugasLuarDetails(id)
    .then((data) => {
      this.Coursedetails = data;
  }, err => console.error(err));
}


async getListTugas() {
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

}
