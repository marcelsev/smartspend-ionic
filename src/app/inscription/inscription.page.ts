import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage {
  newUserForm: FormGroup;
  surnameExists: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.newUserForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, this.checkTermsValidator],
    });
  }
  checkTermsValidator(control: AbstractControl) {
    if (!control.value) {
      return { notAccepted: true };
    }
    return null;
  }
  createUser(): void {
    const { name, surname, email, password } = this.newUserForm.value;

    this.userService.createUser(name, surname, email, password).subscribe(
      () => {
        this.newUserForm.reset(); 
        
        this.router.navigate(['/index']);
      },
      (error) => {
        console.error('Error al crear usuario:', error);
       
        this.errorMessage = 'Error al crear usuario. Por favor, inténtalo de nuevo.';
      }
    );
  }
  
  


  checkUsername(surname: string): void {
    this.userService.checkUsernameUnique(surname).subscribe(
      (response) => {
        this.surnameExists = response.exists;
      },
      (error) => {
        console.error('Error al verificar el pseudónimo:', error);
      }
    );
  }

  checkPasswordMatch(): void {
    const passwordControl = this.newUserForm.get('password');
    const confirmPasswordControl = this.newUserForm.get('confirmPassword');
    
    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      confirmPasswordControl.setErrors(password === confirmPassword ? null : { notMatch: true });
    }
  }
  
}
