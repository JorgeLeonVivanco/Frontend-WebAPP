import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ValidatorService } from './tools/validator.service';
import { ErrorService } from './tools/error.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Variables para las cookies
const session_cookie_name = 'RoomMate-token';
const user_email_cookie_name = 'RoomMate-email';
const user_id_cookie_name = 'RoomMate-user_id';
const user_complete_name_cookie_name = 'RoomMate-user_complete_name';
const group_name_cookie_name = 'RoomMate-group_name';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {
  constructor(
    private http: HttpClient,
    public router: Router,
    private cookieService: CookieService,
    private validatorService: ValidatorService,
    private errorService: ErrorService
  ) {}

  // Validar login
  public validarLogin(username: String, password: String) {
    const data = {
      username: username,
      password: password
    };
    console.log('Validando login... ', data);
    const error: any = [];

    if (!this.validatorService.required(data['username'])) {
      error['username'] = this.errorService.required;
    } else if (!this.validatorService.max(data['username'], 40)) {
      error['username'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['username'])) {
      error['username'] = this.errorService.email;
    }

    if (!this.validatorService.required(data['password'])) {
      error['password'] = this.errorService.required;
    }

    return error;
  }

  // Iniciar sesión
  login(username: String, password: String): Observable<any> {
    const data = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${environment.url_api}/token/`, data);
  }

  // Cerrar sesión
  logout() {
    const headers = { Authorization: `Bearer ${this.getSessionToken()}` };
    console.log('Encabezados enviados:', headers);
    return this.http.post('http://127.0.0.1:8000/logout/', {}, { headers });
  }
  
  
  clearSession() {
    localStorage.removeItem('token');
  }

  // Obtener usuario firmado
  retrieveSignedUser() {
    const token = this.getSessionToken();
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/me/`, { headers: headers });
  }

  // Gestión de cookies
  getCookieValue(key: string) {
    return this.cookieService.get(key);
  }

  saveCookieValue(key: string, value: string) {
    const secure = environment.url_api.indexOf('https') !== -1;
    this.cookieService.set(key, value, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
  }

  getSessionToken() {
    return this.cookieService.get(session_cookie_name);
  }

  destroyUser() {
    this.cookieService.deleteAll();
  }

  getUserEmail() {
    return this.cookieService.get(user_email_cookie_name);
  }

  getUserCompleteName() {
    return this.cookieService.get(user_complete_name_cookie_name);
  }

  getUserId() {
    return this.cookieService.get(user_id_cookie_name);
  }

  getUserGroup() {
    return this.cookieService.get(group_name_cookie_name);
  }

  // Guardar datos de usuario
  saveUserData(user_data: any) {
    const secure = environment.url_api.indexOf('https') !== -1;
    this.cookieService.set(user_id_cookie_name, user_data.user?.id || user_data.id, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    this.cookieService.set(user_email_cookie_name, user_data.user?.email || user_data.email, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    this.cookieService.set(
      user_complete_name_cookie_name,
      `${user_data.user?.first_name || user_data.first_name} ${user_data.user?.last_name || user_data.last_name}`,
      undefined,
      undefined,
      undefined,
      secure,
      secure ? 'None' : 'Lax'
    );
    this.cookieService.set(session_cookie_name, user_data.token, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    this.cookieService.set(group_name_cookie_name, user_data.rol, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
  }

  // Obtener ID del cliente
  getClienteId(): number | null {
    const userId = this.getUserId();
    if (userId) {
      return parseInt(userId, 10); // Convertir el ID a un número
    }
    console.warn('No se encontró el ID del cliente en las cookies.');
    return null;
  }
}
