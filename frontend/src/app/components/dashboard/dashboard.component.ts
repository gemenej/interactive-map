import { Component, OnDestroy, OnInit } from "@angular/core";
import { LabelType, Options } from "ngx-slider-v2";
import { BehaviorSubject, Subject, map, takeUntil } from "rxjs";
import { Signal } from "src/app/models/signal.model";
import { SignalsService } from "src/app/services/signals.service";
import { WebSocketService } from "src/app/services/web-socket.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  timestamps$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  signals$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  subscription$: Subject<boolean> = new Subject<boolean>();
  options$: BehaviorSubject<Options> = new BehaviorSubject<Options>({
    disabled: false,
    readOnly: true,
    showTicks: false,
    floor: new Date().getTime(),
    ceil: new Date().getTime() - 1000 * 60 * 60 * 12,
    translate: (value: number, label: LabelType): string => {
      return new Date(value).toLocaleTimeString();
    },
  });

  active: boolean = false;
  isConnected: boolean = false;

  value: number = 0;

  constructor(
    private webSocketService: WebSocketService,
    private signalsService: SignalsService
  ) {}

  ngOnInit(): void {
    this.getTimestampsArray();
    this.value = this.timestamps$.value[this.timestamps$.value.length - 1];
  }

  ngOnDestroy(): void {
    this.disconnectWS();
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  changeActivatedData(isActive: boolean) {
    this.active = isActive;

    if (this.active) {
      this.getSignals(this.value);
      this.value = this.timestamps$.value[this.timestamps$.value.length - 1];
      return;
    }

    this.signals$.next([]);
    if (this.isConnected) {
      this.disconnectWS();
    }
    this.value = this.timestamps$.value[this.timestamps$.value.length - 1];
  }

  changeTime(timestamp: number) {
    if (this.isConnected) this.disconnectWS();
    this.value = timestamp;
    this.getSignals(this.value);
  }

  getSignals(timestamp: number) {
    this.signalsService.openDatabase().subscribe({
      next: () => {
        this.signalsService.getDataByTimestamp(timestamp).subscribe({
          next: (signals: Signal[]) => {
            this.signals$.next(signals);
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => console.error(err),
    });
  }

  connectWS() {
    this.isConnected = true;
    this.value = this.timestamps$.value[this.timestamps$.value.length - 1];
    this.getSignals(this.value);

    this.webSocketService
      .createObservableSocket()
      .pipe(
        takeUntil(this.subscription$),
        map((data) => {
          this.getTimestampsArray();
          return JSON.parse(data);
        })
      )
      .subscribe({
        next: (signals: Signal[]) => {
          this.signals$.next(signals);
          this.value =
            this.timestamps$.value[this.timestamps$.value.length - 1];
        },
        error: (err) => {
          console.error(err);
          this.isConnected = false;
        },
      });
  }

  disconnectWS() {
    this.webSocketService.close();
    this.isConnected = false;
    this.getTimestampsArray();
  }

  getTimestampsArray() {
    const lastTimestamp = new Date().getTime();
    const firstTimestamp = lastTimestamp - 1000 * 60 * 60 * 12;
    this.timestamps$.next([firstTimestamp, lastTimestamp]);
    this.options$.next({
      showTicks: false,
      translate: (value: number, label: LabelType): string => {
        return new Date(value).toLocaleTimeString();
      },
      disabled: false,
      readOnly: this.isConnected || !this.active ? true : false,
      floor: firstTimestamp,
      ceil: lastTimestamp,
      step: 1000,
    });
    this.getSignals(lastTimestamp);
    this.value = this.timestamps$.value[this.timestamps$.value.length - 1];
  }
}
