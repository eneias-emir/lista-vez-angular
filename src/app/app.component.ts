import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { PainelComponent } from './painel/painel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, PainelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Lista da Vez - Layla';


}
