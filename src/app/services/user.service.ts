import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { /*User,*/ Role, UserInfo } from 'src/app/shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<UserInfo | null>;
  public userInfo: Observable<UserInfo | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.userSubject = new BehaviorSubject<UserInfo | null>(
      /*JSON.parse(localStorage.getItem('currentUserInfo')!) ||*/ null
    );
    this.userInfo = this.userSubject.asObservable();
    this.jwtHelper = new JwtHelperService();
  }

  public get userValue(): UserInfo | null {
    return this.userSubject.value;
  }

  getSecuredUser() {
    let headers = new HttpHeaders();
    headers = headers.append(
      'Access-Control-Allow-Origin',
      'https://localhost:5000'
    );

    const postOptions = {
      headers: headers,
    };

    return this.http
      .get<any>('http://localhost:5000/secured', postOptions)
      .pipe(
        map((responce) => {
          if (responce['access']) {
            return responce;
          } else {
            console.log('THIS!!!!!!!!!!!');
            console.log('error');
            return throwError(() => 'Auth error');
          }
        })
      );
  }

  getSecuredAdmin() {
    let headers = new HttpHeaders();
    headers = headers.append(
      'Access-Control-Allow-Origin',
      'https://localhost:5000'
    );

    const postOptions = {
      headers: headers,
    };

    return this.http.get<any>('http://localhost:5000/admin', postOptions).pipe(
      map((responce) => {
        console.log(responce);
        if (responce['access']) {
          return responce;
        } else {
          console.log('error');
          return throwError(() => 'Auth error');
        }
      })
    );
  }

  getAllUsers() {
    const postOptions = {
      withCredentials: true,
    };

    return this.http
      .get<any>('https://localhost:5000/api/polz') //, postOptions)
      .pipe(
        map((responce) => {
          console.log('Response ' + responce);
          return responce;
        })
      );
  }

  getUserInfo(uuid: String) {
    const postOptions = {
      withCredentials: true,
    };

    return this.http
      .get<any>('https://localhost:5000/api/polz/' + uuid, postOptions)
      .pipe(
        map((responce) => {
          return responce;
        })
      );
  }

  updateUser(formData: any) {
    const postOptions = {
      withCredentials: true,
    };

    console.log(formData);
    return this.http
      .put<any>(
        'https://localhost:5000/api/polz/' + formData.id,
        formData,
        postOptions
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getStatistic() {
    let headers = new HttpHeaders();
    headers = headers.append(
      'Access-Control-Allow-Origin',
      'https://localhost:5000'
    );

    const postOptions = {
      headers: headers,
    };

    return this.http
      .get<any>('https://localhost:5000/api/meetingsstat', postOptions)
      .pipe(
        map((responce) => {
          return responce;
        })
      );
  }
}
