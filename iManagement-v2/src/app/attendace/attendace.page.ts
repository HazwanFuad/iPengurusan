import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-attendace',
  templateUrl: './attendace.page.html',
  styleUrls: ['./attendace.page.scss'],
})
export class AttendacePage implements OnInit {
  // dateRange: { from: string; to: string; };
  daterange: 'string';
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor() {}

  ngOnInit() {
  }

  onChange($event) {
    console.log($event);
  }

}
