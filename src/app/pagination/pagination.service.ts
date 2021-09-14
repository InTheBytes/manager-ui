import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from './page.type';

@Injectable()
export class PaginationService<T> {
  endpoint!: string
  extraParams!: string
  
  pageSize!: number
  totalPages!: number

  currentPage: number = 0

  constructor(private http: HttpClient) { }

  component!: Observer<Page<T>>
  
  signUp = (endpoint: string, pageSize: number, extraParams?: string): Observable<Page<T>> => 
  new Observable(
    observer => {
      this.component = observer
      this.endpoint = endpoint
      this.pageSize = pageSize
      this.extraParams = extraParams ?? ""
      this.getPage()
    }
  )

  private getPage = (): void => {
    let url: string = `${environment.apiUrl}/${this.endpoint}?page=${this.currentPage}&page-size=${this.pageSize}`
    url += (this.extraParams.length > 0) ? `&${this.extraParams}` : "";
    this.http.get<Page<T>>(url).subscribe(
      resp => {
        this.totalPages = resp.totalPages
        this.component.next(resp)
      },
      err => this.component.error(err)
    )
  }

  changePage = (page: number): void => {
    this.currentPage = page
    this.getPage()
  }

  changeSize = (size: number): void => {
    this.pageSize = size
    this.getPage()
  }

  next = (): void => {
    (++this.currentPage <= this.totalPages) ? this.getPage() : this.currentPage--
  }

  previous = (): void => {
    (--this.currentPage >= 0) ? this.getPage() : this.currentPage++
  }

  changeParams = (params: string): void => {
    this.extraParams = params
    this.getPage()
  }
}
