import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { BusyService } from '../_services/busy.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy(); //a request is underway, start spinner
    return next.handle(request).pipe(
      (environment.production ? identity : delay(1000)), //delay request by 1 sec in dev environ -- simulate slow connection
      finalize(() => {
        this.busyService.idle(); //request complete, turn off spinner 
      })
    );
  };
}
