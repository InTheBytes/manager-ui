import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Authentication, AuthService } from './auth.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    http = TestBed.inject(HttpTestingController)
    service = TestBed.inject(AuthService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return auth status on subscription', done => {
    spyOn(service, 'getAuth').and.returnValue('token')
    service.authNotification().subscribe((result) => {
      expect(result).toEqual(Authentication.AUTHENTICATED)
      done()
    })
  })

  it('should get authentication from storage', () => {
    let retrieveSpy = spyOn(window.localStorage, 'getItem').and.returnValue(`${moment().format(service.timestampFormat)} | token`)
    expect(service.getAuth()).toEqual('token')
    expect(retrieveSpy).toHaveBeenCalledWith('auth')
  })

  it('should not return expired tokens', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(`${moment().subtract(3, 'hours').format(service.timestampFormat)} | token`)
    let removeSpy = spyOn(window.localStorage, 'removeItem')
    expect(service.getAuth()).toBeNull()
    expect(removeSpy).toHaveBeenCalledWith('auth')
  })

  it('should remove from storage and update subscription on logout', done => {
    let retrieveSpy = spyOn(window.localStorage, 'getItem').and.returnValue(`${moment().format(service.timestampFormat)} | token`)
    let removeSpy = spyOn(window.localStorage, 'removeItem')
    service.authNotification().subscribe((result) => {
      if (result == Authentication.AUTHENTICATED) {
        expect(retrieveSpy).toHaveBeenCalledWith('auth')
        service.logout()
      } else {
        expect(result).toEqual(Authentication.NOT_AUTHENTICATED)
        expect(removeSpy).toHaveBeenCalledWith('auth')
        done()
      }
    })
  })

  it('should fetch profile with provided token', done => {
    let user = {username: 'test', role: {name: 'restaurant'}, email: 'test', firstName: 'test', lastName: 'test'}
    service.getProfile('token').then(
      (resp) => {
        expect(resp).toEqual(user)
        done()
      },
      (err) => {
        fail('http request returned error')
        done()
      }
    )
    let req = http.expectOne(`${environment.apiUrl}/user/profile`)
    expect(req.request.method).toEqual('GET')
    expect(req.request.headers.get('Authentication')).toBeTruthy()
    req.flush(user)
  })

  it('should reject non-manager account profiles', done => {
    let user = {username: 'test', role: {name: 'customer'}, email: 'test', firstName: 'test', lastName: 'test'}
    service.getProfile('token').then(
      (resp) => {
        fail('promise resolve a non-manager')
        done()
      },
      (err) => {
        expect(err).toEqual('Account is not a manager')
        done()
      }
    )
    let req = http.expectOne(`${environment.apiUrl}/user/profile`)
    req.flush(user)
  })

  it('should use getAuth if not token provided for profile', () => {
    let authSpy = spyOn(service, 'getAuth').and.returnValue('token')
    service.getProfile()
    expect(authSpy).toHaveBeenCalled()
  })

  it('should send login request and fetch a profile', done => {
    let user = {username: 'test', role: {name: 'restaurant'}, email: 'test', firstName: 'test', lastName: 'test'}
    let profileSpy = spyOn(service, 'getProfile').and.returnValue(Promise.resolve(user))
    service.login('test', 'pass').then(
      (resp) => {
        expect(profileSpy).toHaveBeenCalledWith('token')
        done()
      }, (err) => {
        fail(err)
        done()
      }
    )
    let req = http.expectOne(`${environment.apiUrl}/user/login`)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({username: 'test', password: 'pass'})
    req.flush([], {headers: {authentication: 'token'}})
  })
});
