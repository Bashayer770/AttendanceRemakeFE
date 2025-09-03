import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../index';
import { NodeModel } from '../../models/node';

@Injectable({ providedIn: 'root' })
export class NodeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<NodeModel[]> {
    return this.http.get<NodeModel[]>(API.NODES.GET_ALL);
  }

  getBySerial(serial: string): Observable<NodeModel> {
    return this.http.get<NodeModel>(API.NODES.GET_BY_SERIAL(serial));
  }

  create(node: NodeModel): Observable<void> {
    return this.http.post<void>(API.NODES.CREATE, node);
  }
}
