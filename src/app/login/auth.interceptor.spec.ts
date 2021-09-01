import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
      ]
  }));

  it('should include authentication header', inject([HttpClient, HttpTestingController],
    (http: HttpClient, mockHttp: HttpTestingController) => {

      spyOn(window.localStorage, 'getItem').and.returnValue("Bearer token");
      http.get("/api/url").subscribe(
        resp => expect(resp).toBeTruthy()
      )
      const req = mockHttp.expectOne(req => {
        console.dir(req.headers);
        return (req.headers.has('Authentication') && req.headers.get('Authentication') === 'Bearer token')})
      req.flush({data: 'some test data'});
      mockHttp.verify();
  }));

  it('shoudl exclude token if null', inject([HttpClient, HttpTestingController],
    (http: HttpClient, mockHttp: HttpTestingController) => {

      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      http.get('/api/url').subscribe(
        resp => expect(resp).toBeTruthy()
      )
      const req = mockHttp.expectOne(req => {
        console.dir(req.headers);
        return (req.url === '/api/url' && req.headers.get('Authentication') === null)})
      req.flush({data: 'some test data'})
      mockHttp.verify();
    }));
});
