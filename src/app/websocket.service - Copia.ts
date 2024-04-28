import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry, RetryConfig  } from 'rxjs/operators';

const retryConfig: RetryConfig = {
  count: 100,
  delay: 5000,
};



@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private readonly WS_URL = 'ws://localhost:8000/ws'; // Coloque a URL do seu servidor WebSocket aqui

  public eventOnOpenConnection: EventEmitter<any> = new EventEmitter();

  constructor() {

    this.socket$ = webSocket({url: this.WS_URL,
                              openObserver: {
                                    next: () => {
                                        console.log("### connection ok ###");
                                        this.eventOnOpenConnection.emit();
                                    },
                                },
                              closeObserver: {
                                    next(closeEvent) {
                                        console.log("$$$ connection closed $$$");
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
