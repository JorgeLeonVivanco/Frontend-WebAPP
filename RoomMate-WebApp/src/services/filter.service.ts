import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Importar 'of' para retornar un Observable vacío
import { catchError } from 'rxjs/operators'; // Importar 'catchError' para manejar errores
import { FacadeService } from './facade.service'; // Servicio para manejar la sesión
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(
    private http: HttpClient,
    private facadeService: FacadeService // Servicio para manejar la sesión
  ) {}

  // Método para obtener las propiedades filtradas
  getFilteredProperties(filters: any): Observable<any> {
    // Verificar si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    if (!token) {
      console.error('Token de sesión no encontrado');
      return of([]);  // Retornar un Observable vacío si no hay token
    }

    // Construir los parámetros para la solicitud GET a partir de los filtros proporcionados
    let params = new HttpParams()
      .set('precio_min', filters.precio_min.toString())
      .set('precio_max', filters.precio_max.toString());

    // Si hay tipo de propiedad, agregarlo
    if (filters.tipo_propiedad) {
      params = params.set('tipo_propiedad', filters.tipo_propiedad);
    }

// Si hay servicios seleccionados, agregarlos al parámetro 'servicios'
if (filters.servicios && filters.servicios.length > 0) {
  const serviciosStr = filters.servicios.join(','); // Convertir el array de servicios a string separado por comas
  params = params.set('servicios_json', serviciosStr);
}

    // Configurar los encabezados con el token de autorización
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Realizar la solicitud GET a la API de filtros y manejar errores
    return this.http.get<any>(`${environment.url_api}/propiedades/filtros/`, {
      params,
      headers,
    }).pipe(
      catchError(error => {
        console.error('Error al obtener las propiedades filtradas', error);
        return of([]);  // Retornar un Observable vacío en caso de error
      })
    );
  }
}
