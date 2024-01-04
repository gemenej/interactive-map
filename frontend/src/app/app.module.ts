import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignalsService } from './services/signals.service';
import { WebSocketService } from './services/web-socket.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NgxSliderModule } from 'ngx-slider-v2';
import { LeafletService } from './services/leaflet.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ControlsComponent } from './components/controls/controls.component';
import {DataFetcherService} from "./services/data-fetcher.service";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DashboardComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxSliderModule
  ],
  providers: [
    SignalsService,
    WebSocketService,
    LeafletService,
    DataFetcherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
