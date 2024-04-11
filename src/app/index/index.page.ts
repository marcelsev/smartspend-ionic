import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage  {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  login(): void {
    // Verifica que el email y la contraseña no estén vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez saisir votre e-mail et votre mot de passe.';
      return;
    }

    // Llama al método login del AuthService
    this.authService.login(this.email, this.password).subscribe(
      () => {
        // Redirige al perfil después de un inicio de sesión exitoso
        this.router.navigate(['/profil']);
      },
      error => {
        console.error('Login failed:', error);
        // Maneja errores de inicio de sesión
        if (error.status === 401) {
          this.errorMessage = 'E-mail ou mot de passe incorrect.';
        } else {
          this.errorMessage = 'Une erreur s\'est produite lors de la connexion.';
        }
      }
    );
  }
}

  
  

