// ===== CONTEXTO GLOBAL - VIA PATRIMONIAL =====
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DadosSistema, Imovel, Receita, Despesa, DespesaTemplate } from './types'
import { carregarDados, salvarDados } from './storage'
import { verificarEGerarCiclo, atualizarStatusAtrasados } from './recorrencia'

interface ContextoTipo {
    dados: DadosSistema
    adicionarImovel: (imovel: Omit<Imovel, 'id' | 'criadoEm'>) => void
    editarImovel: (id: string, imovel: Omit<Imovel, 'id' | 'criadoEm'>) => void
    excluirImovel: (id: string) => void
    marcarReceitaRecebida: (id: string) => void
    adicionarReceita: (receita: Omit<Receita, 'id'>) => void
    editarReceita: (id: string, receita: Omit<Receita, 'id'>) => void
    excluirReceita: (id: string) => void
    marcarDespesaPaga: (id: string) => void
    adicionarDespesa: (despesa: Omit<Despesa, 'id'>) => void
    adicionarDespesaRecorrente: (despesa: Omit<Despesa, 'id'>, template: Omit<DespesaTemplate, 'id'>) => void
    editarDespesa: (id: string, despesa: Omit<Despesa, 'id'>) => void
    excluirDespesa: (id: string) => void
    adicionarTemplate: (template: Omit<DespesaTemplate, 'id'>) => void
    editarTemplate: (id: string, template: Omit<DespesaTemplate, 'id'>) => void
    excluirTemplate: (id: string) => void
    atualizarDados: (dados: DadosSistema) => void
}

const Contexto = createContext<ContextoTipo | null>(null)

function gerarId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function ProvedorContexto({ children }: { children: ReactNode }) {
    const [dados, setDados] = useState<DadosSistema>(() => {
        const dadosCarregados = carregarDados()
        const dadosAtualizados = verificarEGerarCiclo(dadosCarregados)
        return atualizarStatusAtrasados(dadosAtualizados)
    })

    useEffect(() => {
        salvarDados(dados)
    }, [dados])

    function atualizar(novosDados: DadosSistema) {
        setDados(novosDados)
    }

    // ===== IMOVEIS =====
    function adicionarImovel(imovel: Omit<Imovel, 'id' | 'criadoEm'>) {
        const novo: Imovel = {
            ...imovel,
            id: gerarId(),
            criadoEm: new Date().toISOString()
        }
        atualizar({ ...dados, imoveis: [...dados.imoveis, novo] })
    }

    function editarImovel(id: string, imovel: Omit<Imovel, 'id' | 'criadoEm'>) {
        atualizar({
            ...dados,
            imoveis: dados.imoveis.map(item =>
                item.id === id ? { ...item, ...imovel } : item
            )
        })
    }

    function excluirImovel(id: string) {
        atualizar({
            ...dados,
            imoveis: dados.imoveis.filter(item => item.id !== id)
        })
    }

    // ===== RECEITAS =====
    function marcarReceitaRecebida(id: string) {
        atualizar({
            ...dados,
            receitas: dados.receitas.map(item =>
                item.id === id
                    ? { ...item, status: 'Recebido' as const, dataRecebimento: new Date().toISOString() }
                    : item
            )
        })
    }

    function adicionarReceita(receita: Omit<Receita, 'id'>) {
        const nova: Receita = { ...receita, id: gerarId() }
        atualizar({ ...dados, receitas: [...dados.receitas, nova] })
    }

    function editarReceita(id: string, receita: Omit<Receita, 'id'>) {
        atualizar({
            ...dados,
            receitas: dados.receitas.map(item =>
                item.id === id ? { ...item, ...receita } : item
            )
        })
    }

    function excluirReceita(id: string) {
        atualizar({
            ...dados,
            receitas: dados.receitas.filter(item => item.id !== id)
        })
    }

    // ===== DESPESAS =====
    function marcarDespesaPaga(id: string) {
        atualizar({
            ...dados,
            despesas: dados.despesas.map(item =>
                item.id === id
                    ? { ...item, status: 'Pago' as const, dataPagamento: new Date().toISOString() }
                    : item
            )
        })
    }

    function adicionarDespesa(despesa: Omit<Despesa, 'id'>) {
        const nova: Despesa = { ...despesa, id: gerarId() }
        atualizar({ ...dados, despesas: [...dados.despesas, nova] })
    }

    function adicionarDespesaRecorrente(despesa: Omit<Despesa, 'id'>, template: Omit<DespesaTemplate, 'id'>) {
        const nova: Despesa = { ...despesa, id: gerarId() }
        const novoTemplate: DespesaTemplate = { ...template, id: gerarId() }
        atualizar({
            ...dados,
            despesas: [...dados.despesas, nova],
            despesasTemplate: [...dados.despesasTemplate, novoTemplate]
        })
    }

    function editarDespesa(id: string, despesa: Omit<Despesa, 'id'>) {
        atualizar({
            ...dados,
            despesas: dados.despesas.map(item =>
                item.id === id ? { ...item, ...despesa } : item
            )
        })
    }

    function excluirDespesa(id: string) {
        atualizar({
            ...dados,
            despesas: dados.despesas.filter(item => item.id !== id)
        })
    }

    // ===== TEMPLATES =====
    function adicionarTemplate(template: Omit<DespesaTemplate, 'id'>) {
        const novo: DespesaTemplate = { ...template, id: gerarId() }
        atualizar({ ...dados, despesasTemplate: [...dados.despesasTemplate, novo] })
    }

    function editarTemplate(id: string, template: Omit<DespesaTemplate, 'id'>) {
        atualizar({
            ...dados,
            despesasTemplate: dados.despesasTemplate.map(item =>
                item.id === id ? { ...item, ...template } : item
            )
        })
    }

    function excluirTemplate(id: string) {
        atualizar({
            ...dados,
            despesasTemplate: dados.despesasTemplate.filter(item => item.id !== id)
        })
    }

    return (
        <Contexto.Provider value={{
            dados,
            adicionarImovel,
            editarImovel,
            excluirImovel,
            marcarReceitaRecebida,
            adicionarReceita,
            editarReceita,
            excluirReceita,
            marcarDespesaPaga,
            adicionarDespesa,
            adicionarDespesaRecorrente,
            editarDespesa,
            excluirDespesa,
            adicionarTemplate,
            editarTemplate,
            excluirTemplate,
            atualizarDados: atualizar
        }}>
            {children}
        </Contexto.Provider>
    )
}

export function useContexto() {
    const contexto = useContext(Contexto)
    if (!contexto) {
        throw new Error('useContexto deve ser usado dentro do ProvedorContexto')
    }
    return contexto
}