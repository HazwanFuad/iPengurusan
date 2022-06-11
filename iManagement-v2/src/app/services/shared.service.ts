import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() count: EventEmitter<any> = new EventEmitter();

  constructor() { }

  change() {
     this.fire.emit(true);
  }

  change2() {
    this.count.emit('Yes');
  }

  getEmittedValue() {
    return this.fire;
  }

  getEmittedValue2() {
    return this.count;
  }
}
