import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
})
export class ApplyPage implements OnInit {
  date: { from: string; to: string; };
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor() { }

  ngOnInit() {
  }


}
