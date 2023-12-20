import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabelType, Options } from 'ngx-slider-v2';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';
import { Signal } from 'src/app/models/signal.model';
import { SignalsService } from 'src/app/services/signals.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  timestamps$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  signals$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  subscription$: Subject<boolean> = new Subject<boolean>();
  options$: BehaviorSubject<Options> = new BehaviorSubject<Options>({
    disabled: false,
    readOnly: true,
    showTicks: false,
    stepsArray: [],
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
      return;
    }

    this.signals$.next([]);
    if (this.isConnected) {
      this.disconnectWS();
    }
  }

  changeTime(timestamp: number) {
    if (this.isConnected) this.disconnectWS();
    this.value = timestamp;
    this.getSignals(this.value);
  }

  getSignals(timestamp: number) {
    this.signalsService.getSignals(timestamp).subscribe({
      next: (signals: Signal[]) => {
        this.signals$.next(signals);
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
    this.signalsService.getTimestamps().subscribe({
      next: (timestamps: number[]) => {
        this.timestamps$.next(timestamps);
        let stepsArray = timestamps.map((value) => {
          return { value: value };
        });
        this.options$.next({
          showTicks: false,
          translate: (value: number, label: LabelType): string => {
            return new Date(value).toLocaleTimeString();
          },
          disabled: false,
          readOnly: this.isConnected || !this.active ? true : false,
          stepsArray: stepsArray,
        });
        this.value = timestamps[timestamps.length - 1];
        this.getSignals(this.value);
      },
      error: (err) => console.error(err),
    });
  }
}
