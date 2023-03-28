import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //class variables
  title = 'Dating App';
  users: any; //specify type any to hold list of users


  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.http.get("https://localhost:7053/api/users/").subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log("Fetching users complete")
    });
  }
}
