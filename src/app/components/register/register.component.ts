import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: ['', Validators.required],
    });
    this.f['roles'].setValue('User');
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService
      .register(
        this.f['username'].value,
        this.f['firstname'].value,
        this.f['lastname'].value,
        this.f['email'].value,
        this.f['password'].value,
        this.f['roles'].value
      )
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          console.log('Not dostupno');
        },
      });
  }
}
