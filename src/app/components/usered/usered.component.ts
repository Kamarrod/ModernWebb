import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usered',
  templateUrl: './usered.component.html',
  styleUrls: ['./usered.component.css'],
})
export class UserEdComponent {
  firstFormGroup!: FormGroup;
  userId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      id: new FormControl(),
      username: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      password: new FormControl(),
      role: new FormControl(),
    });

    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      this.userService.getUserInfo(this.userId).subscribe({
        next: (response) => {
          this.firstFormGroup = this.formBuilder.group({
            id: [response.id],
            username: [response.userName],
            firstName: [response.firstName],
            lastName: [response.lastName],
            password: [''],
            role: [response.role],
          });
        },
        error: (error) => {
          console.log(error);
          console.log('User info error');
        },
      });
    });
  }

  onRollback() {
    this.router.navigate(['/table']);
  }

  onSubmit() {
    var formData = {
      id: this.f['id'].value,
      username: this.f['username'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
    };
    this.userService.updateUser(formData).subscribe({
      next: () => {
        const returnUrl = '/table';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get f() {
    return this.firstFormGroup.controls;
  }
}
