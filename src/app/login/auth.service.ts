import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  timestampFormat: string = "DD-MM-YYYY HH:mm"
  authDuration: number = 2

  profile!: User | null

  constructor(private http: HttpClient) { }

  rootObservers: Observer<Authentication>[] = []
  authNotification = (): Observable<Authentication> => new Observable(
    observer => {
      this.rootObservers.push(observer)
      if (this.getAuth()) {
        observer.next(Authentication.AUTHENTICATED)
      } else {
        observer.next(Authentication.NOT_AUTHENTICATED)
      }
    }
  )

  updateSubscriptions = (status: Authentication): void => {
    this.rootObservers.forEach(value => value.next(status))
  }

  getAuth = (): string | null => {
    let auth: string | null = window.localStorage.getItem('auth')
    let authArray: string[] = auth?.split(" | ") ?? []
    if (authArray.length === 0) {
      this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
      return null;
    } else {
      let date: moment.Moment = moment(authArray[0], this.timestampFormat)
      if (date.diff(moment(), 'hours') * -1 >= this.authDuration) {
        window.localStorage.removeItem('auth')
        this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
        return null
      } else {
        return authArray[1]
      }
    }
  }

  logout = (): void => {
    this.http.post(`${environment.apiUrl}/user/logout`, {}).subscribe(
      (resp) => {
        window.localStorage.removeItem('auth')
        this.profile = null
        this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
      }, (err) => {
        alert("An Error Occured: " + err.message)
      }
    )
  }

  login = (username: string, password: string): Promise<HttpResponse<any>> => {
    this.updateSubscriptions(Authentication.PROCESSING)
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/login`,{
        username: username,
        password: password
      }, {
        observe: 'response'
      }).subscribe(
        (resp) => {
          let auth = resp.headers.get('authentication')
          if (!auth) {
            this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
            reject("No authentation returned")
          } else {
            this.getProfile(auth).then(
              (profile) => {
                window.localStorage.setItem(
                  'auth', `${moment().format(this.timestampFormat)} | ${auth}`
                )
                this.updateSubscriptions(Authentication.AUTHENTICATED)
                resolve(resp)
              }, (error) => {
                this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
                reject(error)
              }
            )
          }
        }, (err) => {
          this.updateSubscriptions(Authentication.NOT_AUTHENTICATED)
          reject((err.status == 401) ? "Bad credentials" : "Unexpected error")
        }
      )
    })
  }

  getProfile = (auth?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      let token = auth ?? this.getAuth()
      if (!token || token.length === 0) {
        reject("No authentication available")
      } else {
        let head = new HttpHeaders().set(
          'Authentication', token
        )
        this.http.get<User>(`${environment.apiUrl}/user/profile`, {headers: head}).subscribe(
          (resp) => {
            let role = resp["role"]["name"]
            if (role == "restaurant" || role == "manager") {
              this.profile = resp
              resolve(resp)
            } else {
              reject("Account is not a manager")
            }
          }, 
          (err) => {
            reject("Profile request recieved error")
          }
        )
      }
    })
  }
}

export type User = {
  userId: string
  username: string,
  role: {
    name: string
  },
  email: string,
  firstName: string,
  lastName: string
}

export enum Authentication {
  NOT_AUTHENTICATED,
  AUTHENTICATED,
  PROCESSING
}
