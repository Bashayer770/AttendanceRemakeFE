import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../index';
import { Observable } from 'rxjs';
import { Floor } from '../../models/floors';

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Floor[]> {
    return this.http.get<Floor[]>(API.FLOORS.GET_ALL);
  }

  getById(floor: string): Observable<Floor> {
    return this.http.get<Floor>(API.FLOORS.GET_BY_ID(floor));
  }

  search(query: string): Observable<Floor[]> {
    return this.http.get<Floor[]>(API.FLOORS.SEARCH(query));
  }
}
