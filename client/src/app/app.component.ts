import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //class variables
  title = 'Dating App';
  users: any; //specify type any to hold list of users


  constructor(private accountServices: AccountService) {

  }
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString: string | null = localStorage.getItem('user'); //read local storage for user
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountServices.setCurrentUser(user);
  };
};
