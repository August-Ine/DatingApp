import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //model to store user form submission
  model: any = {};
  //boolean is user logged in
  loggedIn = false;

  //inject the account service to our component to send http requests
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  };

  login() {
    //calling the login method from account service
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.loggedIn = true;
      },
      error: error => console.log(error)
    })

  }

}
