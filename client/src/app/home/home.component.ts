import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  registerMode = false;//to conditionally render the registration form

  registerToggle() {
    this.registerMode = !this.registerMode;
  };

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
