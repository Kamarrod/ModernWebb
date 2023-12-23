import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css'],
})
export class SecondComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  logout = () => {
    this.authService.logout();
  };
}
