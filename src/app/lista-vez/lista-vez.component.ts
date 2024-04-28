import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaVezItem } from './lista-vez-item/lista-vez-item'
import { ListaVezItemComponent } from './lista-vez-item/lista-vez-item.component';

@Component({
  selector: 'app-lista-vez',
  standalone: true,
  imports: [CommonModule, ListaVezItemComponent],
  templateUrl: './lista-vez.component.html',
  styleUrl: './lista-vez.component.css'
})
export class ListaVezComponent {
  @Input() listaVez!: ListaVezItem[];
  @Input() tituloLista!: string;
  @Output() altStatusMain = new EventEmitter<ListaVezItem>();

  acao(nome: string) {
    console.log('Ação executada para:', nome);
  }

  altStatusListEvent($event: any) {
    //console.log($event);
    this.altStatusMain.emit($event);
  }


}
