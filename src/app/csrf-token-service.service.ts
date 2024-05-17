import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsrfTokenService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getCsrfToken(): Observable<string> {
    return this.http
      .get<any>('http://localhost:3000/getCsrfToken', { withCredentials: true })
      .pipe(
        map((response) => response.csrfToken),
        catchError((error) => {
          console.error('Error al obtener el token CSRF:', error);
          return throwError('No se pudo obtener el token CSRF.');
        })
      );
  }
}
