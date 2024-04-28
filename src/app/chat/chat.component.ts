import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common'
import { WebSocketService } from '../websocket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageToSend: string = '';
  statusConn: string = 'inactive';

  constructor(private webSocketService: WebSocketService) {
    /*
    webSocketService
      .onOpenConnection()
      .subscribe(() => {
          this.connectSubject();
          console.log('onOpenConnection event subscribed')
        });
        */
  }

  ngOnInit(): void {
    //this.connectSubject();

    /*
    this.webSocketService.onMessage().subscribe(
      {
        next: (message: any) => {
          this.messages.push(message);
          this.statusConn = 'connected';
        },
        error: (error: any) => {
                this.statusConn = 'Error on subscribe. ';
                console.error('Error on subscribe', error);
        }
      });
*/

    /*
    this.webSocketService.onMessage().subscribe(
      (message: any) => {
          this.messages.push(message);
          this.statusConn = 'connected';
      },
      (error) => {
        this.statusConn = 'not connected: ' + JSON.stringify(error);
      },
    );
    */

  }

  connectSubject() {
    this.webSocketService.onMessage().subscribe(
      {
        next: (message: any) => {
          this.messages.push(message);
          this.statusConn = 'connected';
        },
        error: (error: any) => {
                this.statusConn = 'Error on subscribe. ';
                console.error('Error on subscribe', error);
        }
      });

  }

  sendMessage(): void {
    if (this.messageToSend.trim() !== '') {
      if (this.webSocketService.isConnected()) {
        this.webSocketService.sendMessage(this.messageToSend);
        this.messageToSend = '';
        console.log('send message')
      } else {
        console.log('websocket disconnected!!!');
        this.statusConn = 'disconnected. ';
      }
    }
  }
}
