import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DataFetcherService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker("/assets/workers/async-data-fetcher.js");
    this.worker.onmessage = (event: MessageEvent) => this.onMessage(event);
    this.worker?.postMessage(["INIT", environment.apiWSUrl]);
  }

  onMessage(event: MessageEvent) {
    console.log("got message from worker!");
  }
}
