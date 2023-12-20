import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Observable, of } from 'rxjs';
import { MapObj } from '../models/map.model';

@Injectable({
  providedIn: 'root',
})
export class LeafletService {
  constructor() {}

  public getCoordsOfMap(): Observable<MapObj> {
    const mapObj = {
      center: [50.000001, 30.0],
      zoom: 10,
    };
    return of(mapObj);
  }

  public getParamsOfTiles(): Observable<L.TileLayer> {
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 1,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    return of(tiles);
  }

  makeMarkers(map: L.Map, points: any): void {
    for (const c of points) {
      const lon = c.point.lon;
      const lat = c.point.lat;
      const marker = L.marker([lat, lon]);
      marker.addTo(map);
    }
  }

  removeMarkers(map: L.Map): void {
    if (map instanceof L.Map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
    }
  }

  removeStatesLayer(map: L.Map): void {
    if (map instanceof L.Map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.remove();
        }
      });
    }
  }
}
