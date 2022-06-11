import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  dateRange: { from: string; to: string; };
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
