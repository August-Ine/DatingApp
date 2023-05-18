import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { NgxGalleryThumbnailsComponent } from '@kolkov/ngx-gallery';
import { Router, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUser$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        //auth token
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    //start hub connection
    this.hubConnection.start().catch(error => console.log(error));

    //listen for presence hub method invocation
    this.hubConnection.on('UserIsOnline', username => {
      //add user to observable
      this.onlineUser$.pipe(take(1)).subscribe({
        next: usernames => {
          this.onlineUsersSource.next([...usernames, username]);
        }
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      //remove user from observable
      this.onlineUser$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next(usernames.filter(u => u !== username))
      })
    })

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        })
    })
  }

  //method to stop hub connection
  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
