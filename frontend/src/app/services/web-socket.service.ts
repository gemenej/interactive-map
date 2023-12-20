import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  ws!: WebSocket;
  private url: string = `${environment.apiWSUrl}`;

  constructor() {}

  createObservableSocket(): Observable<any> {
    this.ws = new WebSocket(this.url);
    return new Observable((observer) => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
    });
  }

  close(): void {
    this.ws.close();
  }
}
