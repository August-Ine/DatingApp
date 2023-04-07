import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0; //count of http requests

  constructor(private spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRequestCount++; //new request
    this.spinnerService.show(undefined, { //show loading spinner
      type: 'ball-fussion',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    })
  };

  idle() {
    this.busyRequestCount--; //request complete
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide(); // hide spinner
    }
  };
}
