import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

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

  // Método para insertar un nuevo depósito (deposit)
  createDeposit(depositData: any): Observable<any> {
    const url = `${this.apiUrl}/deposit`;
    return this.http.post(url, depositData).pipe(
      catchError((error) => {
        console.error('Error al crear depósito:', error);
        return throwError('Error al crear depósito'); // Puedes manejar el error aquí o reenviarlo al componente
      })
    );
  }
}
