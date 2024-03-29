import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage {
  newUserForm: FormGroup;
  surnameExists: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
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
    if (this.surnameExists || !this.newUserForm.valid) {
      return;
    }

    const { confirmPassword, ...userData } = this.newUserForm.value;
    console.log('Datos del nuevo usuario:', userData); 
    delete userData.confirmPassword;
    this.userService.createUser(userData).subscribe(
      (response) => {
        console.log('Usuario creado:', response);
        this.newUserForm.reset();
        this.router.navigate(['/index']);
      },
      (error) => {
        console.error('Error al crear usuario:', error);
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

  // Validar si las contraseñas coinciden
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
