import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.authService.getCsrfToken().subscribe(
      () => {},
      (error) => {
        console.error('Error al obtener el token CSRF:', error);
      }
    );
  }

  login(): void {
    const csrfToken = this.cookieService.get('XSRF-TOKEN');
    console.log('Token', csrfToken);
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez saisir votre e-mail et votre mot de passe.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/profil']);
      },
      (error) => {
        console.error('Login failed:', error);

        if (error.status === 401) {
          this.errorMessage = 'E-mail ou mot de passe incorrect.';
        } else {
          this.errorMessage = "Une erreur s'est produite, vérifier votre mail et mot de passe.";
        }
      }
    );
  }
}
