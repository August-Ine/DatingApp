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

  //inject the account service to our component to send http requests
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  };

  login() {
    //calling the login method from account service
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => console.log(error)
    })
  };

  logout() {
    this.accountService.logout();
  };

}
