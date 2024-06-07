import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CsrfTokenService } from './csrf-token-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.1.92:3000';

  constructor(
    private http: HttpClient,
    private csrfTokenService: CsrfTokenService,
    private cookieService: CookieService
  ) {}

  getCsrfToken(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/getCsrfToken`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          
          if (response && response.csrfToken) {
            this.cookieService.set('XSRF-TOKEN', response.csrfToken);
          }
        })
      );
  }
  login(email: string, password: string): Observable<any> {
    const csrfToken = this.cookieService.get('XSRF-TOKEN');
    if (!csrfToken) {
      console.error('No se encontró el token CSRF en las cookies.');
      return throwError('Token CSRF no encontrado en las cookies.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfToken,
    });

    return this.http
      .post<any>(
        `${this.apiUrl}/login`,
        { email, password },
        { headers, withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError((error) => {
          console.error('Error en el inicio de sesión:', error);
          return throwError('Error en el inicio de sesión.');
        })
      );
  }

  /* getUserProfile(userId: number): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;

    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error al obtener información del usuario:', error);
        return throwError('Error al obtener información del usuario');
      })
    );
  } */

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token almacenado:', token);

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage');
      return throwError(
        'Token de autenticación no encontrado en el localStorage'
      );
    }

    const userId = this.decodeToken(token).userId;
    console.log('UserID obtenido:', userId);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Cabeceras utilizadas:', headers);

    const url = `${this.apiUrl}/users/${userId}`;
    console.log('URL de solicitud:', url);

    return this.http.get(url, { headers: headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener información del usuario:', error);
        return throwError('Error al obtener información del usuario');
      })
    );
  }
  private decodeToken(token: string): any {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return {};
    }
  }

  logout(): Observable<any> {
    const csrfToken = this.cookieService.get('XSRF-TOKEN');
    if (!csrfToken) {
      console.error('No se encontró el token CSRF en las cookies.');
      return throwError('Token CSRF no encontrado en las cookies.');
    }

    const headers = new HttpHeaders({
      'X-XSRF-TOKEN': csrfToken,
    });

    return this.http
      .post<any>(
        `${this.apiUrl}/logout`,
        {},
        { headers, withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          console.error('Error al cerrar sesión:', error);
          return throwError('Error al cerrar sesión.');
        })
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
}
