import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authentication = window.localStorage.getItem('auth')?.split(" | ")[1]
    return next.handle((authentication) ? 
      request.clone({ headers: request.headers.set("Authentication", authentication)}) :
      request 
    )
  }
}
