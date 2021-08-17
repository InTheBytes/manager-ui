import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';
import { AuthService, Authentication } from './login/auth.service';
import { LoginComponent } from './login/login.component';

type routeItem ={
  route: string,
  name: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `::ng-deep .transparent > mat-dialog-container {
      background-color: var(--background); 
      box-shadow: none
    }`,
    `.spacer { flex: 1 1 auto;}`,
    `mat-toolbar, mat-sidenav { background-color: #2699FB; color: white;}`,
    `mat-sidenav-container { height: calc(100% - 64px); }`,
    `.nav-link, .nav-link:link, .nav-link:visited, .nav-link:hover, .nav-link:active {
      color: white;
      text-decoration: none;
      text-align: center;
    }`,
    `.nav-link { text-align: center; width: 100%; font-weight: 500; font-size: 15px}`
  ]
})
export class AppComponent implements OnInit {
  title: string = 'manager-ui'
  authenticated: boolean = false

  navWidth!: string
  navLinkPadding!: string

  routes: routeItem[] = [
    {route: '/home', name: 'Home'},
    {route: '/', name: 'Manage Restaurant'},
    {route: '/', name: 'Manage Orders'},
    {route: '/', name: 'View Order History'},
    {route: '/', name: 'Manage Accounts'},
    {route: '/', name: 'Contact Us'}
  ]

  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    let self = this
    this.auth.authNotification().subscribe({
      next(authenticated) {
        switch (authenticated) {
          case Authentication.AUTHENTICATED:
            self.authenticated = true;
            self.dialog.closeAll()
            break
          case Authentication.NOT_AUTHENTICATED:
            self.authenticated = false;
            self.dialog.closeAll()
            self.dialog.open(LoginComponent, {
              disableClose: true
            })
            break
          case Authentication.PROCESSING:
            self.dialog.open(MatSpinner, {
              panelClass: 'transparent',
              disableClose: true
            })
        }
      }})
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe((result) => {
      for (const observe of Object.keys(result.breakpoints)) {
        if (result.breakpoints[observe]) {
          switch (observe) {
            case "(max-width: 599.98px)":
            case "(min-width: 600px) and (max-width: 959.98px)":
              this.navWidth = "50%"
              this.navLinkPadding = "10% 5%"
              break
            case "(min-width: 960px) and (max-width: 1279.98px)":
              this.navWidth = "40%"
              this.navLinkPadding = "10% 5%"
              break
            case "(min-width: 1280px) and (max-width: 1919.98px)":
            case "(min-width: 1920px)":
              this.navWidth = "25%"
              this.navLinkPadding = "10% 10%"
          }
        }
      }
    })
  }

  logout() {
    this.auth.logout()
  }
}

@Component({
  selector: 'app-home',
  template: `
    <div class='welcome'>
      <h1>Welcome to StackLunch Restaurant Management</h1>
    </div>
  `,
  styles: [
    `.welcome { display: flex; margin: 0 auto; width: 45%;}`,
    `h1 { 
      color: #2699FB; 
      font-family: Georgia, Times, 'Times New Roman', serif; 
      font-size: 2.5em;
      line-height: 2em
    }`
  ]
})
export class HomeComponent {
  constructor() { }
}
