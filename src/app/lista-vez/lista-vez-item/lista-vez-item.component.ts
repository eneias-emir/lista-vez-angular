import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';

import { ListaVezItem } from './lista-vez-item'
import { StatusListaVez } from '../StatusListaVez';

const BUTTON_ICON_LIST = {
  listaAtivos: {left: "pi pi-clock", right: "pi pi-cart-plus"},
  listaEmAtendimento: {left: "pi pi-thumbs-down-fill", right: "pi pi-thumbs-up-fill"},
  listaOcupados: {left: "pi pi-times-circle", right: "pi pi-check-circle"}
}

@Component({
  selector: 'app-lista-vez-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, ChipModule],
  templateUrl: './lista-vez-item.component.html',
  styleUrl: './lista-vez-item.component.css'
})
export class ListaVezItemComponent {
  @Input() listaVezItem!: ListaVezItem;
  @Input() statusDisponivel!: boolean;
  @Output() altStatusEvent = new EventEmitter<ListaVezItem>();

  idLeftButton = 1;
  idRightButton = 2;

  descMotivo: any = "";
  iconLeftButton  = BUTTON_ICON_LIST.listaAtivos.left;
  iconRightButton = BUTTON_ICON_LIST.listaAtivos.right;
  badgeVisible: boolean = false;

  ngOnChanges(changes: SimpleChange): void {
    if (this.listaVezItem.id_status == StatusListaVez.ID_STATUS_DISPONIVEL) {
      this.iconLeftButton = BUTTON_ICON_LIST.listaAtivos.left;
      this.iconRightButton = BUTTON_ICON_LIST.listaAtivos.right;
    } else if (this.listaVezItem.id_status == StatusListaVez.ID_STATUS_EM_ATENDIMENTO) {
      this.iconLeftButton = BUTTON_ICON_LIST.listaEmAtendimento.left;
      this.iconRightButton = BUTTON_ICON_LIST.listaEmAtendimento.right;
    } else if (this.listaVezItem.id_status == StatusListaVez.ID_STATUS_OCUPADO) {
      this.iconLeftButton = BUTTON_ICON_LIST.listaOcupados.left;
      this.iconRightButton = BUTTON_ICON_LIST.listaOcupados.right;
      this.descMotivo = this.listaVezItem.desc_motivo;
      this.badgeVisible = true;
    };
  }

  altStatus(event: any) {
    let obj = this.listaVezItem;

    if (event == this.idRightButton) {
      if (obj.id_status == StatusListaVez.ID_STATUS_DISPONIVEL) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_EM_ATENDIMENTO;
      } else if (obj.id_status == StatusListaVez.ID_STATUS_EM_ATENDIMENTO) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_FINALIZADO;
        obj.venda_efetuada = 'S';
      } else if (obj.id_status == StatusListaVez.ID_STATUS_OCUPADO) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_FINALIZADO;
        obj.venda_efetuada = 'N';
      }
    } else {
      if (obj.id_status == StatusListaVez.ID_STATUS_DISPONIVEL) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_OCUPADO;
      } else if (obj.id_status == StatusListaVez.ID_STATUS_EM_ATENDIMENTO) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_FINALIZADO;
        obj.venda_efetuada = 'N';
      } else if (obj.id_status == StatusListaVez.ID_STATUS_OCUPADO) {
        obj.id_novo_status = StatusListaVez.ID_STATUS_FINALIZADO;
        obj.venda_efetuada = 'N';
      }


    }

    this.altStatusEvent.emit(obj);
  }


}
