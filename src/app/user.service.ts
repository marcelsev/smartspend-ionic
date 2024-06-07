import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.1.92:3000';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  checkUsernameUnique(surname: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/users/check-surname/${surname}`
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  private getCsrfToken(): Observable<string> {
    return this.http
      .get<any>(`${this.apiUrl}/getCsrfToken`, { withCredentials: true })
      .pipe(
        map((response) => response.csrfToken), 
        catchError((error) => {
          console.error('Error al obtener el token CSRF:', error);
          return throwError('No se pudo obtener el token CSRF.');
        })
      );
  }
  
  createUser(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.getCsrfToken().pipe(
      catchError((error) => {
        console.error('Error al obtener el token CSRF:', error);
        return throwError('No se pudo obtener el token CSRF.');
      }),
     
      switchMap((csrfToken: string) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        });

        const userData = { name, surname, email, password };

        return this.http
          .post<any>(`${this.apiUrl}/users`, userData, {
            headers,
            withCredentials: true,
          })
          .pipe(
            catchError((error) => {
              console.error('Error al crear usuario:', error);
              return throwError('Error al crear usuario.');
            })
          );
      })
    );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/users/${userId}`,
      userData
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }
}
