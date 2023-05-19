import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        this.setCurrentUser(user);
      }
      ));
  };

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map((response: User) => {
        const user = response;
        this.setCurrentUser(user);
      })
    )
  }

  setCurrentUser(user: User) {
    if (user) {
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
      //connect to presence hub
      this.presenceService.createHubConnection(user);
    };
  }

  logout() {
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
    this.presenceService.stopHubConnection();
  };

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
