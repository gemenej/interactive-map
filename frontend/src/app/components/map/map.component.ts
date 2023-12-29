import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LeafletService } from '../../services/leaflet.service';
import * as L from 'leaflet';
import { take } from 'rxjs';
import { MapObj } from 'src/app/models/map.model';
import {DataFetcherService} from "../../services/data-fetcher.service";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() signals: any[] = [];
  @Input() active: boolean = false;

  public map: L.Map = {} as L.Map;

  constructor(private leafletService: LeafletService,
              private dataFetcher: DataFetcherService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.active) {
      this.addMarkers();
    }
    if (changes['signals'] && this.active) {
      this.addMarkers();
    }
    if (changes['active'] && !this.active) {
      this.leafletService.removeMarkers(this.map);
      this.leafletService.removeStatesLayer(this.map);
    }
  }

  ngAfterViewInit(): void {
    this.setMap();
  }

  setMap() {
    this.leafletService
      .getCoordsOfMap()
      .pipe(take(1))
      .subscribe((mapObj: MapObj) => {
        this.map = L.map('map', {
          center: mapObj.center as L.LatLngExpression,
          zoom: mapObj.zoom,
        });
        this.initTiles();
      });
  }

  initTiles() {
    this.leafletService
      .getParamsOfTiles()
      .pipe(take(1))
      .subscribe((tiles: L.TileLayer) => {
        tiles.addTo(this.map);
      });
  }

  addMarkers() {
    this.leafletService.removeMarkers(this.map);
    this.leafletService.makeMarkers(this.map, this.signals);
    this.initStatesLayer();
  }

  private initStatesLayer() {
    this.leafletService.removeStatesLayer(this.map);
    const coords: any[] = this.signals.map((signal) =>
      signal.zone.map((zone: { lat: number; lon: number }) => [
        zone.lat,
        zone.lon,
      ])
    );

    const stateLayer = L.polygon(coords, {
      color: 'red',
    }).addTo(this.map);
  }
}
