import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    if (this.authService.isLoggedIn()) {
      return true; // El usuario está autenticado, permite la navegación
    } else {
      this.router.navigate(['/']); // Redirige al usuario a la página de inicio de sesión si no está autenticado
      return false;
    }
  }
}
