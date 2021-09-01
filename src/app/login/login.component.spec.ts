import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService = {
    login() {}
  }

  let mockSnackBar = {
    open() {
      return {
      onAction: () => of({})
    }},
    dismiss() {

    }
  }

  let mockDialogRef = {
    close() {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MatSnackBar, useValue: mockSnackBar},
        {provide: AuthService, useValue: mockAuthService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    const username = fixture.debugElement.query(By.css('.username-field'))
    const password = fixture.debugElement.query(By.css('.password-field'))
    const loginButton = fixture.debugElement.query(By.css('.login-button'))
    expect(username).toBeTruthy()
    expect(password).toBeTruthy()
    expect(loginButton).toBeTruthy()
  })

  it('submit should be disabled with empty values', () => {
    const submit = fixture.debugElement.query(By.css('.login-button'))
    expect(fixture.nativeElement.querySelector('button').disabled).toBeTruthy()
  })

  it('should call service login, open Notification, and dialog close with onLogin', done => {
    let authSpy = spyOn(component.authService, 'login').and.returnValue(Promise.resolve(new HttpResponse()))
    let dialogSpy = spyOn(component.dialogRef, 'close')
    let notificationSpy = spyOn(component, 'openNotification')
    component.onLogin()
    fixture.whenStable().then(() => {
      expect(authSpy).toHaveBeenCalled()
      expect(dialogSpy).toHaveBeenCalled()
      expect(notificationSpy).toHaveBeenCalledWith("Login Successful!")
      done()
    })
  })

  it('should open Notification with login error', done => {
    spyOn(component.authService, 'login').and.returnValue(Promise.reject("Bad credentials"))
    let notificationSpy = spyOn(component, 'openNotification')
    component.onLogin()
    fixture.whenStable().then(() => {
      expect(notificationSpy).toHaveBeenCalledWith("Username or password incorrect")
      done()
    })
  })

  it('should open snackbar with open notification', done => {
    let errorSpy = spyOn(component.errorBar, 'open').and.callThrough()
    component.openNotification('test')
    fixture.whenStable().then(() => {
      expect(errorSpy).toHaveBeenCalledWith('test', 'Okay', {duration: 5000})
      done()
    })
  })
});
