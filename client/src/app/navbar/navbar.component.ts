import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //model to store user form submission
  model: any = {};

  //inject the account service to our component to send http requests
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  };

  login() {
    //calling the login method from account service
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.toastr.info("login successful");
        this.model = {};
      },
      error: error => this.toastr.error(error.error)
    })
  };

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  };

}
