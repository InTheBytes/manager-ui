import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { Authentication, AuthService } from './login/auth.service';
import { LoginComponent } from './login/login.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let mockDialog = {
    open(comp: any, config?: any) {},
    closeAll() {}
  }

  let mockAuthService = {
    authNotification() {return of(Authentication.AUTHENTICATED)},
    logout() {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        BreakpointObserver,
        {provide: MatDialog, useValue: mockDialog},
        {provide: AuthService, useValue: mockAuthService}
      ]
    }).compileComponents();
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement)
  })

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  it(`should have as title 'manager-ui'`, () => {   
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app.title).toEqual('manager-ui');
  });

  it('should call logout on button click', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    let logoutSpy = spyOn(app, 'logout')
    let button = fixture.debugElement.query(By.css(".logout-button")).nativeElement
    button.click()
    fixture.detectChanges()
    expect(logoutSpy).toHaveBeenCalled()
  })

  it('should call service logout', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    let logoutSpy = spyOn(app.auth, 'logout')
    app.logout()
    expect(logoutSpy).toHaveBeenCalled()
  })

  it('should open sidebar with nav-button', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(".sidebare"))).toBeFalsy
    let button = fixture.debugElement.query(By.css(".nav-button")).nativeElement
    button.click()
    fixture.detectChanges()
    expect(fixture.debugElement.query(By.css(".sidebar"))).toBeTruthy()
  })

  it('should render app title', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    let title = fixture.debugElement.queryAll(By.css('span')).find((x) => x.nativeElement.textContent = "Stacklunch")
    expect(title).toBeTruthy()
  })

  it('should open LoginComponent with no auth', () => {
    spyOn(mockAuthService, 'authNotification').and.returnValue(of(Authentication.NOT_AUTHENTICATED))
    let dialogSpy = spyOn(mockDialog, 'open')
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalledWith(LoginComponent, {disableClose: true})
    expect(fixture.debugElement.query(By.css('.logout-button'))).toBeFalsy()
  })

  it('should open progress spinner when authentication', () => {
    spyOn(mockAuthService, 'authNotification').and.returnValue(of(Authentication.PROCESSING))
    let dialogSpy = spyOn(mockDialog, 'open')
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalledWith(MatSpinner, {panelClass: 'transparent', disableClose: true})
  })

  it('should close any dialogs wwhen autheticated', () => {
    spyOn(mockAuthService, 'authNotification').and.returnValue(of(Authentication.AUTHENTICATED))
    let dialogSpy = spyOn(mockDialog, 'closeAll')
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled()
    expect(fixture.debugElement.query(By.css('.logout-button'))).toBeTruthy()
  })
});
