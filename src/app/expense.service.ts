import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getExpensesByUserId(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage');
      return throwError('Token de autenticación no encontrado en el localStorage');
    }
    const userId = this.decodeToken(token).userId;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/expense`;
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
  createExpense(expenseData: any): Observable<any> {
    const url = `${this.apiUrl}/expense`;
    return this.http.post(url, expenseData).pipe(
      catchError((error) => {
        console.error('Error al crear expense:', error);
        return throwError('Error al crear expense'); // Puedes manejar el error aquí o reenviarlo al componente
      })
    );
  }
}
