import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { interval } from 'rxjs';
import { timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.jwtHelper = new JwtHelperService();
    this.userSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser')!) || null
    );
    this.user = this.userSubject.asObservable();
    timer(100).subscribe(() => {
      this.refreshTokens();
    });
    interval(30000).subscribe(() => {
      this.refreshTokens();
    });
  }

  login(username: string, password: string) {
    var formData = {
      username: username,
      password: password,
    };
    return this.http
      .post<any>('https://localhost:5000/api/authentication/login', formData, {
        withCredentials: true,
      })
      .pipe(
        map((user) => {
          if (!user['accessToken']) {
            this.userSubject.next(null);
            return throwError(() => 'AuthError');
          } else {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // var c = atob(user);\
            console.log(this.jwtHelper.decodeToken(user['accessToken']));
            const role = this.jwtHelper.decodeToken(user['accessToken'])[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
            user.role = role;
            // console.log('C = ' + c);
            this.userSubject.next(user);
            return user;
          }
        })
      );
  }

  private refreshAccessToken(currentUser: User, reloading: boolean) {
    console.log('start of executin refreshAccessToken');
    const formData = {
      accesstoken: currentUser.accessToken,
      refreshtoken: currentUser.refreshToken,
    };
    this.http
      .post<any>('https://localhost:5000/api/token/refresh', formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (user) => {
          //console.log('start real Refresh Access');
          currentUser.accessToken = user.accessToken;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.userSubject.next(currentUser);
          if (reloading) location.reload();
        },
        error: () => {
          //console.log('Logout in refreshAccessToken');
          this.logout();
        },
        complete: () => {
          //console.log('complete refreshAccessToken Observable');
        },
      });
    console.log('End refreshAccessToken');
  }

  private refreshRefreshToken(currentUser: User) {
    const formData = {
      accesstoken: currentUser.accessToken,
      refreshtoken: currentUser.refreshToken,
    };
    return this.http
      .post<any>('https://localhost:5000/api/token/refresh', formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (user) => {
          //var values = atob(user);
          currentUser.refreshToken = user.refreshtoken;
          currentUser.accessToken = user.accesstoken;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.userSubject.next(currentUser);
        },
        error: () => {
          this.logout();
        },
      });
  }
  refreshTokens(reloading = false) {
    const today = new Date();
    const currentUser = this.userValue;
    console.log(currentUser);
    if (!currentUser) return;
    //console.log('Refresh start');
    if (today > currentUser.update_date) {
      this.refreshRefreshToken(currentUser);
    } else {
      this.refreshAccessToken(currentUser, reloading);
    }
    //console.log('Refresh end');
  }

  register(
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    roles: []
  ) {
    var formData = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      roles: [],
    };

    return this.http
      .post<any>('https://localhost:5000/api/authentication', formData, {
        withCredentials: true,
      })
      .pipe(
        map((user) => {
          if (!user['accessToken']) {
            this.userSubject.next(null);
            return throwError(() => 'AuthError');
          } else {
            console.log(this.jwtHelper.decodeToken(user['accessToken']));
            const role = this.jwtHelper.decodeToken(user['accessToken'])[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
            user.role = role;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
          }
        })
      );
  }
  public get userValue(): User | null {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
