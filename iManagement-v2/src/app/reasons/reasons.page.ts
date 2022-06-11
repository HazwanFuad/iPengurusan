import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-reasons',
  templateUrl: './reasons.page.html',
  styleUrls: ['./reasons.page.scss'],
})
export class ReasonsPage implements OnInit {
  // reasonsegmentModel: string = "lor";

  dateRange: { from: string; to: string; };
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor() { }

  ngOnInit() {
  }

  onChange($event) {
    console.log($event);
  }

}
