import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { CsrfTokenService } from './csrf-token-service.service';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private apiUrl = 'http://localhost:3000';
  constructor(
    private http: HttpClient,
    private csrfTokenService: CsrfTokenService
  ) {}

  getDepositsByUserId(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage');
      return throwError(
        'Token de autenticación no encontrado en el localStorage'
      );
    }
    const userId = this.decodeToken(token).userId;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/deposit`;
    return this.http.get<any[]>(url, { headers: headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener expenses:', error);
        return throwError('Error al obtener expenses');
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

  
  createDeposit(depositData: any): Observable<any> {
    return this.csrfTokenService.getCsrfToken().pipe(
      catchError((error) => {
        console.error('Error al obtener el token CSRF:', error);
        return throwError('No se pudo obtener el token CSRF.');
      }),
      switchMap((csrfToken: string) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        });

        return this.http
          .post<any>(`${this.apiUrl}/deposit`, depositData, {
            headers,
            withCredentials: true,
          })
          .pipe(
            catchError((error) => {
              console.error('Error al crear gasto:', error);
              return throwError('Error al crear gasto.');
            })
          );
      })
    );
  }
}
