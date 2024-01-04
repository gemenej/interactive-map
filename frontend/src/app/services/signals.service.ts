import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SignalsService {
  private dbName = "signals";
  private storeName = "signals";

  private worker: Worker;

  constructor() {
    this.worker = new Worker("/assets/workers/db-worker.js");
  }

  openDatabase(): Observable<void> {
    return new Observable((observer) => {
      this.worker.onmessage = ({ data }) => {
        const { type, payload } = data;

        switch (type) {
          case "openDatabaseSuccess":
            observer.next();
            observer.complete();
            break;
          case "error":
            observer.error(payload);
            break;
        }
      };

      this.worker.postMessage({
        type: "openDatabase",
        payload: { dbName: this.dbName, storeName: this.storeName },
      });
    });
  }

  getDataByTimestamp(timestamp: number): Observable<any[]> {
    return new Observable((observer) => {
      this.worker.onmessage = ({ data }) => {
        const { type, payload } = data;

        switch (type) {
          case "getDataByTimestampSuccess":
            observer.next(payload);
            observer.complete();
            break;
          case "error":
            observer.error(payload);
            break;
        }
      };

      this.worker.postMessage({
        type: "getDataByTimestamp",
        payload: { storeName: this.storeName, timestamp },
      });
    });
  }
}
