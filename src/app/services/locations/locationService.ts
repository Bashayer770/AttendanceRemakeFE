import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../models/locations';
import { API } from '../index';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(API.LOCATIONS.GET_ALL);
  }
 
  getById(code: number): Observable<Location> {
    return this.http.get<Location>(API.LOCATIONS.GET_BY_ID(code));
  }
 
  create(location: Location): Observable<Location> {
return this.http.post<Location>(API.LOCATIONS.CREATE, location);
  }
 
  update(code: number, location: Location): Observable<void> {
    return this.http.put<void>(API.LOCATIONS.UPDATE(code), location);
  }
 
  delete(code: number): Observable<void> {
  return this.http.delete<void>(API.LOCATIONS.DELETE(code));
}


  search(query: string): Observable<Location[]> {
    return this.http.get<Location[]>(API.LOCATIONS.SEARCH(query));
  }
}