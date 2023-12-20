import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getTimestamps(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}timestamps`);
  }

  getSignals(timestamp: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}history/${timestamp}/signals`);
  }
}
