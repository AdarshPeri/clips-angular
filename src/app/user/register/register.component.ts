import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(99),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [
    Validators.required
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11),
  ]);
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  }, [RegisterValidators.match('password', 'confirmPassword')]);

  showAlert = false;
  alertMessage = 'Please wait while your account is being created!';
  alertColor = 'blue';
  inSubmission = false;
  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait while your account is being created!';
    this.alertColor = 'blue';
    const { email, password } = this.registerForm.value;
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value)
    } catch (e) {
      this.alertMessage = 'An unexpected error occured. Please try again!';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMessage = 'Your account has been successfully created.';
    this.alertColor = 'green';
  }
}
