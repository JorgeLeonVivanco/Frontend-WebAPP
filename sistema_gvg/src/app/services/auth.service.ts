// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000'; // URL de la API de inicio de sesión

  constructor(private http: HttpClient) {}

  login(credentials: { matricula: string; password: string }) {
    return this.http.post<{ token: string; user: { matricula: string; email: string; role: string } }>(
      'http://127.0.0.1:8000/login/', // Asegúrate de que esta URL sea correcta
      credentials
    );
  }
  

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
