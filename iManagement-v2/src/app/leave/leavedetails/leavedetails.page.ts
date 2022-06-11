import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-leavedetails',
  templateUrl: './leavedetails.page.html',
  styleUrls: ['./leavedetails.page.scss'],
})
export class LeavedetailsPage implements OnInit {
  public Leavedetails = {};
  public myleave = {};
  public mycode = {};
  public descCode = {};


  constructor(
    private route: ActivatedRoute,
    private sqlite: SqliteService,
  ) {
    this.getLeaveDetails();
  }

  ngOnInit() {
  }

  async getLeaveDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sqlite.getDetailsLeave(id)
    .then((data) => {
      this.Leavedetails = data;
      this.sqlite.getLeaveCode(this.Leavedetails[0].LeaveCode)
      .then((Codedetails) => {
        this.mycode = Codedetails;
        this.descCode = this.mycode[0].LeaveDesc;
    }, err => console.error(err));
  }, err => console.error(err));
}

}
