import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry, RetryConfig  } from 'rxjs/operators';
import { config } from './app-params';

const retryConfig: RetryConfig = {
  count: Number(config.webSocketServer.retryCount),
  delay: Number(config.webSocketServer.retryDelay)
};

export enum StatusSocket {
  opened, closed
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  private readonly WS_URL = config.webSocketServer.url;

  private socketSubject: Subject<StatusSocket> = new Subject();
  //connChangeEvent$: Observable<any> = this.socketSubject.asObservable();

  constructor() {


    this.socket$ = webSocket({url: this.WS_URL,
                              openObserver: {
                                    next: (event) => {
                                        this.socketSubject.next(StatusSocket.opened);
                                        console.log("### connection ok ###");
                                        console.log(event);
                                    },
                                },
                              closeObserver: {
                                    next: (closeEvent) => {
                                        this.socketSubject.next(StatusSocket.closed);
                                        console.log("$$$ connection closed $$$");
                                        console.log(closeEvent);

                                    }
                                }
    });

    // Subscribe to the error observable to catch errors
    this.socket$.asObservable().pipe(
      retry(retryConfig) // Retry connection
    ).subscribe({
      error: (error: any) =>  {
                      console.error('WebSocket error:', error);
                      // Handle the error here, e.g., display a message to the user
                    }
      }
    );

  }

  public onStatusChange(): Observable<any> {
    return this.socketSubject.asObservable();
  }

  public connect(): WebSocketSubject<any> {
    console.log('connect method executed');
    console.log(this.socket$.closed);

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.WS_URL);
      console.log('try to connect');
    }
    return this.socket$;
  }

  public sendMessage(message: any): void {
    this.connect();
    this.socket$.next(message); //.error({code: 4000, reason: 'I think our app just broke!'});
  }

  public onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  /*
  public onOpenConnection(): Observable<any> {
    return of('onOpenConnection');
  }
  */

  public isConnected(): boolean {
    return (this.socket$ === null ? false : !this.socket$.closed);
  }
}
