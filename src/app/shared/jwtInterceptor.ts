import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environments';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userInfo = this.authenticationService.userValue;
    const isLoggedIn = userInfo && userInfo?.accessToken;
    const isRefreshApiUrl = request.url.startsWith(environment.refreshtokenUrl);
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl && !isRefreshApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + userInfo.accessToken,
        },
      });
    }

    return next.handle(request);
  }
}

export const JwtProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
