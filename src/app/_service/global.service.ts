import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getRequest(url: string): Observable<any> {
    return this.http.get(this.apiUrl + url);
  }

  getByParamRequest(url: string, params: any): Observable<any> {
    return this.http.get(this.apiUrl + url + '/' + params);
  }

  postRequest(url: string, data: any): Observable<any> {
    return this.http.post(this.apiUrl + url, data);
  }

  deleteRequest(url: string, id: any): Observable<any> {
    return this.http.delete(this.apiUrl + url + `/${id}`);
  }

  deleteRequestMultiple(url: string, id: any, id2: any): Observable<any> {
    return this.http.delete(this.apiUrl + url + `/${id}`+`/${id2}`);
  }

  /**
   * for refreshing page
   */
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

}
