export interface Signal {
  timestamp: number;
  frequency: number;
  point: Point;
  zone: Zone[];
}

export interface Zone {
  lat: number;
  lon: number;
}

export interface Point {
  lat: number;
  lon: number;
}
