import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Page } from './page.type';

import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  type test = {
    name: string
  }

  function pageMaker(page: number): Page<test> {
    return {
      content: [
        {name: `test-${page}-1`},
        {name: `test-${page}-2`},
        {name: `test-${page}-3`}
      ],
      totalElements: 30,
      totalPages: 10,
      size: 3,
      number: page
    }
  }

  let service: PaginationService<test>;
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaginationService
      ]
    });
    service = TestBed.inject(PaginationService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send first page on signUp', done => {
    service.signUp("test", 3).subscribe(
      resp => {
        expect(resp).toEqual(pageMaker(0))
        done()
      }, 
      err => fail("Observable sent an error")
    )

    const req = http.expectOne(`${environment.apiUrl}/test?page=0&page-size=3`)
    req.flush(pageMaker(0))
  })

  it('should send next page on next', done => {
    service.signUp("test", 3).subscribe(
      resp => {
        if (resp.number == 0) {
          service.next()
          const req = http.expectOne(`${environment.apiUrl}/test?page=1&page-size=3`)
          req.flush(pageMaker(1))
        } else {
          expect(resp).toEqual(pageMaker(1))
          done()
        }
      }, 
      err => fail("Observable sent an error")
    )
    const req = http.expectOne(`${environment.apiUrl}/test?page=0&page-size=3`)
    req.flush(pageMaker(0))
  })

  it('should change to provided page number', done => {
    service.signUp("test", 3).subscribe(
      resp => {
        if (resp.number == 0) {
          service.changePage(3)
          const req = http.expectOne(`${environment.apiUrl}/test?page=3&page-size=3`)
          req.flush(pageMaker(3))
        } else {
          expect(resp).toEqual(pageMaker(3))
          done()
        }
      }, 
      err => fail("Observable sent an error")
    )
    const req = http.expectOne(`${environment.apiUrl}/test?page=0&page-size=3`)
    req.flush(pageMaker(0))
  })

  it('should go back a page on previous', done => {
    service.signUp("test", 3).subscribe(
      resp => {
        if (resp.number == 0) {
          service.changePage(3)
          const req = http.expectOne(`${environment.apiUrl}/test?page=3&page-size=3`)
          req.flush(pageMaker(3))
        } else if (resp.number == 3) {
          service.previous()
          const req = http.expectOne(`${environment.apiUrl}/test?page=2&page-size=3`)
          req.flush(pageMaker(2))
        } else {
          expect(resp).toEqual(pageMaker(2))
          done()
        }
      }, 
      err => fail("Observable sent an error")
    )
    const req = http.expectOne(`${environment.apiUrl}/test?page=0&page-size=3`)
    req.flush(pageMaker(0))
  })

  it('should send request with any extra parameters', done => {
    service.signUp('test', 3, 'extra=true&params=2').subscribe(
      resp => {
        expect(resp).toEqual(pageMaker(0))
        done()
      },
      err => fail("Observable sent an error")
    )
    const req = http.expectOne(`${environment.apiUrl}/test?page=0&page-size=3&extra=true&params=2`)
    req.flush(pageMaker(0))
  })
});
