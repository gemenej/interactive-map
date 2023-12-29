import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Signal, Zone, Point } from "../models/signal.model";
import Dexie, { Collection } from 'dexie';

@Injectable({
    providedIn: 'root',
})
export class DBService {
    constructor(){}
}
