import { HttpClient } from '@angular/common/http';
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


  constructor(private http: HttpClient, private accountServices: AccountService) {

  }
  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }
  getUsers() {
    this.http.get("https://localhost:7053/api/users/").subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log("Fetching users complete")
    });
  };
  setCurrentUser() {
    const userString: string | null = localStorage.getItem('user'); //read local storage for user
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountServices.setCurrentUser(user);
  };
};
