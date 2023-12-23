import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User, User2 } from 'src/app/shared/helpers';

@Component({
  selector: 'app-custom-table',
  styleUrls: ['table.component.css'],
  templateUrl: 'table.component.html',
  standalone: true,
  imports: [MatTableModule, CommonModule],
})
export class TableComponent {
  displayedColumns: string[] = ['uuid', 'username', 'role', 'button'];
  data!: User2[];
  dataSource = new MatTableDataSource<User2>();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.data = response;
        //console.log('Users' + response.id);
        this.dataSource.data = this.data;
      },
      error: (error) => {
        console.log(error);
        console.log('Authentication error');
      },
    });
  }

  getUserInfo(id: String) {
    console.log('Start' + id);
    this.router.navigate(['/usered', id]);
  }
}
