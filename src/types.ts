// ===== TIPOS DO SISTEMA VIA PATRIMONIAL =====

export type TipoImovel =
    | 'Casa'
    | 'Apartamento'
    | 'Sala Comercial'
    | 'Loja'
    | 'Galpao'
    | 'Terreno'
    | 'Chacara'
    | 'Predio Comercial'
    | 'Outros'

export type StatusPagamento = 'Pendente' | 'Recebido' | 'Atrasado' | 'Pago'

export type CategoriaDespesa =
    | 'Agua'
    | 'Luz'
    | 'IPTU'
    | 'Condominio'
    | 'Internet'
    | 'Manutencao'
    | 'Salarios'
    | 'Outros'

// ===== IMOVEL =====
export interface Imovel {
    id: string
    nome: string
    tipo: TipoImovel
    endereco: string
    nomeInquilino: string
    telefoneInquilino: string
    valorAluguel: number
    diaVencimento: number
    observacoes: string
    valorEstimado?: number
    ativo: boolean
    criadoEm: string
    dataInicioContrato?: string
    dataFimContrato?: string
}

// ===== RECEITA =====
export interface Receita {
    id: string
    imovelId: string
    nomeImovel: string
    nomeInquilino: string
    valor: number
    mes: number
    ano: number
    dataVencimento: string
    status: StatusPagamento
    dataRecebimento?: string
    observacoes: string
}

// ===== DESPESA =====
export interface Despesa {
    id: string
    nome: string
    categoria: CategoriaDespesa
    imovelId?: string
    nomeImovel?: string
    valor: number
    mes: number
    ano: number
    dataVencimento: string
    status: StatusPagamento
    dataPagamento?: string
    observacoes: string
    recorrente: boolean
}

// ===== TEMPLATE DE DESPESA RECORRENTE =====
export interface DespesaTemplate {
    id: string
    nome: string
    categoria: CategoriaDespesa
    valor: number
    diaVencimento: number
    observacoes: string
    ativo: boolean
}

// ===== DADOS GERAIS DO SISTEMA =====
export interface DadosSistema {
    imoveis: Imovel[]
    receitas: Receita[]
    despesas: Despesa[]
    despesasTemplate: DespesaTemplate[]
    ultimoCicloGerado: string
}