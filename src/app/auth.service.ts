import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Almacenar el token en el localStorage después de iniciar sesión correctamente
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError('Une erreur s\'est produite lors de la connexion.');
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
      return throwError('Token de autenticación no encontrado en el localStorage');
    }
  
    const userId = this.decodeToken(token).userId;
    console.log('UserID obtenido:', userId);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Cabeceras utilizadas:', headers);
  
    const url = `${this.apiUrl}/users/${userId}`;
    console.log('URL de solicitud:', url);
  
    return this.http.get(url, { headers : headers }).pipe(
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
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError((error) => {
        console.error('Error al cerrar sesión:', error);
        return throwError('Error al cerrar sesión');
      })
    );
  }
}