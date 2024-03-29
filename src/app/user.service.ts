import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  checkUsernameUnique(surname: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users/check-surname/${surname}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users');
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/users', user);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/users/${userId}`);
  }
}
