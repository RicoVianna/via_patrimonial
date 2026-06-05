// ===== RECORRENCIA MENSAL - VIA PATRIMONIAL =====
// Responsavel por gerar automaticamente receitas e despesas de cada novo mes

import { DadosSistema, Receita, Despesa } from './types'
import { salvarDados } from './storage'

// ===== GERAR ID UNICO =====
function gerarId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ===== VERIFICAR E GERAR NOVO CICLO =====
export function verificarEGerarCiclo(dados: DadosSistema): DadosSistema {
    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()
    const cicloAtual = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`

    // Se o ciclo ja foi gerado este mes, nao faz nada
    if (dados.ultimoCicloGerado === cicloAtual) {
        return dados
    }

    const dadosAtualizados = { ...dados }

    // ===== GERAR RECEITAS DOS IMOVEIS ATIVOS =====
    const novasReceitas: Receita[] = dados.imoveis
        .filter(imovel => imovel.ativo)
        .map(imovel => {
            const dataVencimento = new Date(anoAtual, mesAtual - 1, imovel.diaVencimento)
            return {
                id: gerarId(),
                imovelId: imovel.id,
                nomeImovel: imovel.nome,
                nomeInquilino: imovel.nomeInquilino,
                valor: imovel.valorAluguel,
                mes: mesAtual,
                ano: anoAtual,
                dataVencimento: dataVencimento.toISOString(),
                status: 'Pendente' as const,
                observacoes: ''
            }
        })

    // ===== GERAR DESPESAS DOS TEMPLATES ATIVOS =====
    const novasDespesas: Despesa[] = dados.despesasTemplate
        .filter(template => template.ativo)
        .map(template => {
            const dataVencimento = new Date(anoAtual, mesAtual - 1, template.diaVencimento)
            return {
                id: gerarId(),
                nome: template.nome,
                categoria: template.categoria,
                valor: template.valor,
                mes: mesAtual,
                ano: anoAtual,
                dataVencimento: dataVencimento.toISOString(),
                status: 'Pendente' as const,
                observacoes: template.observacoes,
                recorrente: true
            }
        })

    // ===== ATUALIZAR STATUS DE ITENS ATRASADOS =====
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    dadosAtualizados.receitas = dados.receitas.map(receita => {
        if (receita.status === 'Pendente') {
            const vencimento = new Date(receita.dataVencimento)
            vencimento.setHours(0, 0, 0, 0)
            if (vencimento < hoje) {
                return { ...receita, status: 'Atrasado' as const }
            }
        }
        return receita
    })

    dadosAtualizados.despesas = dados.despesas.map(despesa => {
        if (despesa.status === 'Pendente') {
            const vencimento = new Date(despesa.dataVencimento)
            vencimento.setHours(0, 0, 0, 0)
            if (vencimento < hoje) {
                return { ...despesa, status: 'Atrasado' as const }
            }
        }
        return despesa
    })

    // ===== ADICIONAR NOVOS REGISTROS =====
    dadosAtualizados.receitas = [...dadosAtualizados.receitas, ...novasReceitas]
    dadosAtualizados.despesas = [...dadosAtualizados.despesas, ...novasDespesas]
    dadosAtualizados.ultimoCicloGerado = cicloAtual

    salvarDados(dadosAtualizados)

    return dadosAtualizados
}

// ===== ATUALIZAR STATUS ATRASADOS =====
export function atualizarStatusAtrasados(dados: DadosSistema): DadosSistema {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const dadosAtualizados = {
        ...dados,
        receitas: dados.receitas.map(receita => {
            if (receita.status === 'Pendente') {
                const vencimento = new Date(receita.dataVencimento)
                vencimento.setHours(0, 0, 0, 0)
                if (vencimento < hoje) {
                    return { ...receita, status: 'Atrasado' as const }
                }
            }
            return receita
        }),
        despesas: dados.despesas.map(despesa => {
            if (despesa.status === 'Pendente') {
                const vencimento = new Date(despesa.dataVencimento)
                vencimento.setHours(0, 0, 0, 0)
                if (vencimento < hoje) {
                    return { ...despesa, status: 'Atrasado' as const }
                }
            }
            return despesa
        })
    }

    return dadosAtualizados
}