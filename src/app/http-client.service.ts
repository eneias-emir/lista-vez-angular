import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../environments/environment';
import { config } from './app-params';

import { MotivoListaVez } from './lista-vez/MotivoListaVez';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  //baseUrl: string = 'http://localhost:8000';
  //baseUrl: string = environment.httpServer;
  baseUrl: string = config.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public getListaMotivo(): Observable<MotivoListaVez[]> {
    return this.httpClient.get<MotivoListaVez[]>(`${this.baseUrl}/lista_status`).pipe(
      map(response => response.map(res => {
        return res;
      }))

    );


  }

}
