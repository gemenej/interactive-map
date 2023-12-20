import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ChangeContext, Options } from 'ngx-slider-v2';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements AfterViewInit {
  @Input() active: boolean = false;
  @Input() isConnected: boolean = false;
  @Input() timestamps: any[] = [];
  @Input() options: Options = {
    showTicks: false,
    stepsArray: [],
    readOnly: true,
  };
  @Input() value: number = 0;

  @Output() shown: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() timeChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() startWSConnection: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() stopWSConnection: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  isLoaded: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.value = 0;
    this.options.stepsArray = this.timestamps.map((s) => s.timestamp);
    this.onChangeReadOnly(this.active);
    this.options = Object.assign({}, this.options, { readOnly: true });
    this.isLoaded = true;
  }

  toggleActiveStateAndEmit() {
    this.active = !this.active;
    this.shown.emit(this.active);
    this.onChangeReadOnly(this.active);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.timeChanged.emit(changeContext.value);
  }

  onChangeReadOnly(readOnly: boolean): void {
    this.options = Object.assign({}, this.options, { readOnly: !readOnly });
  }

  onWSConnect() {
    this.startWSConnection.emit(true);
    this.isConnected = true;
  }

  onWSDisconnect() {
    this.stopWSConnection.emit(true);
    this.isConnected = false;
  }
}
