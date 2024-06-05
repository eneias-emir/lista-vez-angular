import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ListaVezItem } from '../lista-vez/lista-vez-item/lista-vez-item'
import { ListaVezComponent } from '../lista-vez/lista-vez.component'
import { WebSocketService, StatusSocket } from '../websocket.service';
import { WsMessage, Comando } from '../websocket.message';
import { StatusListaVez } from '../lista-vez/StatusListaVez';
import { HttpClientService } from './../http-client.service';
import { MotivoListaVez } from '../lista-vez/MotivoListaVez';

interface RegAtendente {
  cod_atendente: number;
  nome_atendente: string;
}

enum TipoAtendente {
  tipoCalcado = '001',
  tipoConfeccao = '002'
}

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, ListaVezComponent, ToolbarModule, ButtonModule, SelectButtonModule,
            SidebarModule, ListboxModule, FormsModule, MessagesModule, InputTextareaModule],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent implements OnInit {

  private subscription: Subscription | undefined;
  messagesDialog: Message[] = [];
  atendenteSelecionado: any;
  motivoSelecionado: any;
  sidebarAtendenteVisible: boolean = false;
  sidebarMotivoVisible: boolean = false;
  messages: string[] = [];
  messageToSend = new WsMessage(Comando.AddListaVez);
  statusConn: string = 'inactive';
  observacao: string = '';

  tituloListaDisponivel = 'Disponíveis';
  tituloListaEmAtendimento = 'Em atendimento';
  tituloListaOcupado = 'Ocupados';

  listaMotivos: MotivoListaVez[] = [];
  listaMotivosFiltrados: MotivoListaVez[] = [];
  listaAtivos: RegAtendente[] = [];

  listaDisponiveis: ListaVezItem[] = [];
  listaIndisponiveis: ListaVezItem[] = [];
  listaEmAtendimento: ListaVezItem[] = [];

  tipoAtendenteFiltro = TipoAtendente.tipoCalcado;
  tipoAtendenteStateOptions: any[] = [{ label: 'CA', value: TipoAtendente.tipoCalcado },{ label: 'CF', value: TipoAtendente.tipoConfeccao }];

  constructor(private webSocketService: WebSocketService, private httpClientService: HttpClientService) {
  }

  ngOnInit(): void {
    this.subscription = this.httpClientService.getListaMotivo().subscribe(res => {
        this.listaMotivos = res;
    });

    this.webSocketService.onStatusChange().subscribe( (statusSocket: StatusSocket) => {

                                                                  this.connectSubject();
                                                                  if (statusSocket == StatusSocket.opened) {
                                                                    //this.getListaVez();
                                                                  } else {

                                                                  }

                                                                });


  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  gravarMotivo() {
    if (this.motivoSelecionado) {
      this.messageToSend.comando = Comando.AltStatusListaVez;
      this.messageToSend.id_motivo = this.motivoSelecionado.id;
      this.messageToSend.obs = this.observacao;
      this.sendMessage();

      this.sidebarMotivoVisible = false;
    } else {
      this.messagesDialog = [{ severity: 'warn', summary: '', detail: 'Selecione o motivo' }];
    }
  }

  desistirMotivo() {
    this.sidebarMotivoVisible = false;
  }

  desistirSelecionarAtendente() {
    this.sidebarAtendenteVisible = false;
  }

  selecionarAtendente() {
    if (this.atendenteSelecionado) {

      this.addListaVez(this.atendenteSelecionado.cod_atendente)

      this.sidebarAtendenteVisible = false;

    } else {
      this.messagesDialog = [{ severity: 'warn', summary: '', detail: 'Selecione o atendente' }];
    }
  }

  getAtendentesAtivos() {
    this.messageToSend.comando = Comando.GetAtendenteAtivo;
    this.sendMessage();
    this.sidebarAtendenteVisible = true;
  }

  getListaVez() {
    this.messageToSend.comando = Comando.GetListaVez;
    this.sendMessage();
  }

  listaAtendentesTipoFiltro(lista: Array<ListaVezItem>): Array<ListaVezItem> {
    return lista.filter(item => item.tipo_atendente === this.tipoAtendenteFiltro);
  }

  addListaVez(codAtendente: number) {
    this.messageToSend.comando = Comando.AddListaVez;
    this.messageToSend.cod_atendente = codAtendente;
    this.sendMessage();
  }


  connectSubject() {

    this.webSocketService.onMessage().subscribe(
      {
        next: (message: any) => {
          this.messages.push(message);
          this.statusConn = 'connected';

          if (message.listaVez.disponiveis) {
            this.listaDisponiveis = message.listaVez.disponiveis;
            this.listaEmAtendimento = message.listaVez.em_atendimento;
            this.listaIndisponiveis = message.listaVez.ocupados;

          }
          if (message.listaAtendentesAtivos) {
            this.listaAtivos = message.listaAtendentesAtivos;
          }

        },
        error: (error: any) => {
                this.statusConn = 'Error on subscribe. ';
                console.error('Error on subscribe', error);
        }
      });

  }

  sendMessage(): void {
    if (this.webSocketService.isConnected()) {
      this.webSocketService.sendMessage(   this.messageToSend  );
      this.messageToSend.clear();
    } else {
      console.log('websocket disconnected!!!');
      this.statusConn = 'disconnected. ';
    }
  }

  necessarioSolicitarMotivo($event: any): boolean {
    let result = false;

    let venda_efetuada = 'N'
    if ($event.venda_efetuada) {
      venda_efetuada = $event.venda_efetuada;
    }

    if ( ($event.id_status == StatusListaVez.ID_STATUS_DISPONIVEL) && ($event.id_novo_status == StatusListaVez.ID_STATUS_OCUPADO) ) {
      result = true;
    } else if ( ($event.id_status == StatusListaVez.ID_STATUS_EM_ATENDIMENTO) && ($event.id_novo_status == StatusListaVez.ID_STATUS_FINALIZADO) && (venda_efetuada == 'N') ) {
      result = true;
    }

    return result;
  }

  solicitarMotivoAltStatus(id_status: number) {
    this.motivoSelecionado = null;
    this.listaMotivosFiltrados = this.listaMotivos.filter((motivo) => motivo.id_status == id_status);
    this.observacao = '';
    this.sidebarMotivoVisible = true;
  }

  altStatusItemLista($event: any) {
    let venda_efetuada = 'N';
    if ($event.venda_efetuada) {
      venda_efetuada = $event.venda_efetuada;
    }

    // salva os parametros em messageToSend. Se for necessario solicitar o motivo, esses dados serao aproveitados na chamada apos informar o motivo
    this.messageToSend.cod_atendente = $event.cod_atendente;
    this.messageToSend.comando = Comando.AltStatusListaVez;
    this.messageToSend.id_lista_vez = $event.id_lista_vez;
    this.messageToSend.id_novo_status = $event.id_novo_status;
    this.messageToSend.id_motivo = 0;
    this.messageToSend.id_prevenda = 0;
    this.messageToSend.obs = this.observacao;
    this.messageToSend.venda_efetuada = venda_efetuada;

    // se nao for necessario solicitar motivo, efetua a chamada de alteracao de status.
    if (this.necessarioSolicitarMotivo($event)) {
      this.solicitarMotivoAltStatus($event.id_status)
    } else {
      this.sendMessage();
    }

  }



}
