import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['mat-form-field {width: 100%;}']
})
export class LoginComponent {

  @Output() loginComplete: EventEmitter<boolean> = new EventEmitter();
  
  username: string = ''
  password: string = ''
  loading: boolean = false

  constructor(
    public authService: AuthService,
    public errorBar: MatSnackBar,
    public dialogRef: MatDialogRef<LoginComponent>
    ) { }

  onLogin(): void {
    this.dialogRef.close()
    this.authService.login(this.username, this.password).then(
      (resp) => {
        this.openNotification("Login Successful!")
        this.loginComplete.emit(true)
      }, (err) => {
        let message: string
        switch (err) {
          case 'Bad credentials':
            message = 'Username or password incorrect'
            break
          case 'Account is not a manager':
            message = 'This portal is exclusively for restaurant manager accounts'
            break
          case 'No authentication returned':
          case 'Profile request recieved error':
            message = 'Unable to authenticate your account. Please try again later'
            break
          default:
            message = 'An unexpected error occured. Please try again later'
        }
        this.openNotification(message)
      }
    )
  }

  openNotification(message: string): void {
    let notification = this.errorBar.open(message, 'Okay', {
      duration: 5000
    });
    notification.onAction().subscribe(() => this.errorBar.dismiss())
  }

}
