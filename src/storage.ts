// ===== STORAGE - VIA PATRIMONIAL =====
// Responsavel por salvar e carregar todos os dados do sistema

import { DadosSistema } from './types'

// Chave usada para salvar no Local Storage
const CHAVE_STORAGE = 'via_patrimonial_dados'

// ===== DADOS INICIAIS (sistema vazio) =====
const dadosIniciais: DadosSistema = {
    imoveis: [],
    receitas: [],
    despesas: [],
    despesasTemplate: [],
    ultimoCicloGerado: ''
}

// ===== CARREGAR DADOS =====
// Busca os dados salvos no navegador
// Se nao houver nada salvo, retorna os dados iniciais
export function carregarDados(): DadosSistema {
    try {
        const salvo = localStorage.getItem(CHAVE_STORAGE)
        if (!salvo) return dadosIniciais
        return JSON.parse(salvo) as DadosSistema
    } catch {
        return dadosIniciais
    }
}

// ===== SALVAR DADOS =====
// Salva todos os dados no navegador
export function salvarDados(dados: DadosSistema): void {
    try {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados))
    } catch (erro) {
        console.error('Erro ao salvar dados:', erro)
    }
}

// ===== EXPORTAR BACKUP =====
// Gera um arquivo JSON para download
export function exportarBackup(dados: DadosSistema): void {
    const json = JSON.stringify(dados, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `via_patrimonial_backup_${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
}

// ===== IMPORTAR BACKUP =====
// Le um arquivo JSON e restaura os dados
export function importarBackup(arquivo: File): Promise<DadosSistema> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target?.result as string) as DadosSistema
                resolve(dados)
            } catch {
                reject(new Error('Arquivo invalido'))
            }
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsText(arquivo)
    })
}