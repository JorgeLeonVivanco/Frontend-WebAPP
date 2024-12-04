import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorService } from './tools/error.service';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorService,
    private facadeService: FacadeService
  ) {}

  public esquemaUsuario(): Record<string, any> {
    return {
      direccion: '',
      habitaciones: '',
      capacidad: '',
      precio: '',
      servicios_json: [],
      sanitarios: '',
      telefono: '',
      estados: '',
      imagenes: []
    };
  }

  // Registrar propiedad
  public registrarPropiedad(data: any, images: File[]): Observable<any> {
    const formData: FormData = new FormData();
    const token = this.facadeService.getSessionToken();
    const clienteId = this.facadeService.getClienteId();

    // Validar si el cliente existe
    if (!clienteId) {
      console.error('Error: No se encontró un cliente asociado.');
      throw new Error('No se encontró un cliente asociado al usuario actual.');
    }

    // Añadir el ID del cliente a los datos
    data.cliente = clienteId;

    // Añadir los datos de la propiedad al FormData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
        formData.append(key, value);
      }
    }

    // Añadir las imágenes al FormData
    images.forEach((image) => {
      formData.append('imagenes', image);
    });

    // Configurar los encabezados con el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Realizar la solicitud POST
    return this.http.post<any>(`${environment.url_api}/propiedades/`, formData, { headers });
  }

  // Obtener lista de propiedades
  public obtenerListaPropiedades(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const userId = this.facadeService.getUserId(); // Obtener el ID del usuario autenticado

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Agregar el ID del usuario como parámetro en la solicitud
    return this.http.get<any>(
      `${environment.url_api}/lista-propiedades/?user_id=${userId}`,
      { headers }
    );
  }

  // Obtener propiedad por ID
  public getPropiedadByID(idPropiedad: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    const url = `${environment.url_api}/propiedades/${idPropiedad}/`;
    return this.http.get<any>(url, { headers });
  }

  // Eliminar propiedad
  public eliminarPropiedad(idUser: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
    return this.http.delete<any>(`${environment.url_api}/propiedades-edit/?id=${idUser}`, { headers });
  }

  // Editar propiedad
  public editarPropiedad(id: number, data: any, images: File[]): Observable<any> {
    const formData: FormData = new FormData();
    const token = this.facadeService.getSessionToken();

    // Validar si el cliente existe
    const clienteId = this.facadeService.getClienteId();
    if (!clienteId) {
      console.error('Error: No se encontró un cliente asociado.');
      throw new Error('No se encontró un cliente asociado al usuario actual.');
    }

    // Añadir el ID del cliente a los datos
    data.cliente = clienteId;
    data.id = id;

    // Asegurarnos de que el campo 'servicios_json' esté en formato JSON serializado
    if (data.servicios_json && Array.isArray(data.servicios_json)) {
      formData.append('servicios_json', JSON.stringify(data.servicios_json));
    } else if (data.servicios_json) {
      formData.append('servicios_json', data.servicios_json);  // En caso de que ya esté en formato adecuado
    }

    // Añadir los demás campos de la propiedad al FormData
    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== 'servicios_json') {  // Evitar repetir el campo 'servicios_json'
        const value = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
        formData.append(key, value);
      }
    }

    // Añadir las imágenes al FormData
    images.forEach((image) => {
      formData.append('imagenes', image);
    });

    // Configurar los encabezados con el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Realizar la solicitud PUT (ya que estamos actualizando la propiedad)
    return this.http.put<any>(`${environment.url_api}/propiedades/${id}/`, formData, { headers });
  }
}
