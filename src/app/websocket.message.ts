export enum Comando {
  AddListaVez = 'add_lista_vez',
  GetListaVez = 'get_lista_vez',
  GetAtendenteAtivo = 'get_atendente_ativo',
  AltStatusListaVez = 'alt_status_lista_vez'
}

interface WebSocketMessage {
  comando: Comando;
  id_lista_vez?: number;
  cod_atendente?: number;
  id_novo_status?: number;
  id_motivo?: number;
  id_prevenda?: number;
  obs?: string;
  venda_efetuada?: string;
}


export class WsMessage implements WebSocketMessage {
  comando: Comando;
  cod_atendente?: number;
  id_novo_status?: number;
  id_lista_vez?: number;
  id_motivo?: number;
  id_prevenda?: number;
  obs?: string;
  venda_efetuada?: string;

  constructor(comando: Comando) {
    this.comando = comando;
  }

  clear() {
    this.comando = Comando.AddListaVez;

    this.cod_atendente = undefined;
    this.id_novo_status = undefined;
    this.id_lista_vez = undefined;
    this.id_motivo = undefined;
    this.id_prevenda = undefined;
    this.obs = undefined;
    this.venda_efetuada = undefined;

  }


}
