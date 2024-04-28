export interface ListaVezItem {
  id_lista_vez: number;
  cod_atendente: number;
  nome_atendente: string;
  ordem: number;
  id_status: number;
  id_novo_status?: number;
  venda_efetuada?: string;
  desc_motivo?: string;
}
