// ===== EXPORTACAO EXCEL E PDF - VIA PATRIMONIAL =====
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DadosSistema } from './types'

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

function formatarData(dataISO: string): string {
    return new Date(dataISO).toLocaleDateString('pt-BR')
}

function nomeMes(mes: number, ano: number): string {
    return new Date(ano, mes - 1, 1).toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
    })
}

// ===== EXPORTAR EXCEL =====
export function exportarExcel(dados: DadosSistema, mes: number, ano: number) {
    const wb = XLSX.utils.book_new()

    // aba de imoveis
    const imoveisData = dados.imoveis
        .filter(i => i.ativo)
        .map(i => ({
            'Nome': i.nome,
            'Tipo': i.tipo,
            'Endereco': i.endereco,
            'Inquilino': i.nomeInquilino,
            'Telefone': i.telefoneInquilino,
            'Aluguel': i.valorAluguel,
            'Dia Vencimento': i.diaVencimento,
            'Valor Estimado': i.valorEstimado || 0,
        }))
    const wsImoveis = XLSX.utils.json_to_sheet(imoveisData)
    XLSX.utils.book_append_sheet(wb, wsImoveis, 'Imoveis')

    // aba de receitas do mes
    const receitasData = dados.receitas
        .filter(r => r.mes === mes && r.ano === ano)
        .map(r => ({
            'Imovel': r.nomeImovel,
            'Inquilino': r.nomeInquilino,
            'Valor': r.valor,
            'Vencimento': formatarData(r.dataVencimento),
            'Status': r.status,
            'Recebido em': r.dataRecebimento ? formatarData(r.dataRecebimento) : '',
        }))
    const wsReceitas = XLSX.utils.json_to_sheet(receitasData)
    XLSX.utils.book_append_sheet(wb, wsReceitas, 'Receitas')

    // aba de despesas do mes
    const despesasData = dados.despesas
        .filter(d => d.mes === mes && d.ano === ano)
        .map(d => ({
            'Nome': d.nome,
            'Categoria': d.categoria,
            'Imovel': d.nomeImovel || 'Geral',
            'Valor': d.valor,
            'Vencimento': formatarData(d.dataVencimento),
            'Status': d.status,
            'Pago em': d.dataPagamento ? formatarData(d.dataPagamento) : '',
        }))
    const wsDespesas = XLSX.utils.json_to_sheet(despesasData)
    XLSX.utils.book_append_sheet(wb, wsDespesas, 'Despesas')

    // aba de rateio
    const totalRecebido = dados.receitas
        .filter(r => r.mes === mes && r.ano === ano && r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const totalDespesas = dados.despesas
        .filter(d => d.mes === mes && d.ano === ano && d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const liquido = totalRecebido - totalDespesas

    const rateioData = (dados.participantes || [])
        .filter(p => p.ativo)
        .map(p => ({
            'Participante': p.nome,
            'Percentual': `${p.percentual}%`,
            'Parte Bruta': formatarMoeda(totalRecebido * p.percentual / 100),
            'Parte Despesas': formatarMoeda(totalDespesas * p.percentual / 100),
            'Valor Liquido': formatarMoeda(liquido * p.percentual / 100),
        }))
    const wsRateio = XLSX.utils.json_to_sheet(rateioData)
    XLSX.utils.book_append_sheet(wb, wsRateio, 'Rateio')

    // baixar arquivo
    const periodo = `${String(mes).padStart(2, '0')}_${ano}`
    XLSX.writeFile(wb, `via_patrimonial_${periodo}.xlsx`)
}

// ===== EXPORTAR PDF MENSAL =====
export function exportarPDFMensal(dados: DadosSistema, mes: number, ano: number) {
    const doc = new jsPDF()
    const periodo = nomeMes(mes, ano)

    // cabecalho
    doc.setFontSize(20)
    doc.setTextColor(30, 58, 95)
    doc.text('Via Patrimonial', 14, 20)
    doc.setFontSize(12)
    doc.setTextColor(90, 106, 126)
    doc.text(`Relatorio Mensal - ${periodo}`, 14, 28)

    // linha separadora
    doc.setDrawColor(228, 232, 239)
    doc.line(14, 32, 196, 32)

    let y = 40

    // resumo financeiro
    const totalRecebido = dados.receitas
        .filter(r => r.mes === mes && r.ano === ano && r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const totalPendente = dados.receitas
        .filter(r => r.mes === mes && r.ano === ano && (r.status === 'Pendente' || r.status === 'Atrasado'))
        .reduce((acc, r) => acc + r.valor, 0)
    const totalDespesas = dados.despesas
        .filter(d => d.mes === mes && d.ano === ano && d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const saldo = totalRecebido - totalDespesas

    doc.setFontSize(13)
    doc.setTextColor(30, 58, 95)
    doc.text('Resumo Financeiro', 14, y)
    y += 8

    autoTable(doc, {
        startY: y,
        head: [['Item', 'Valor']],
        body: [
            ['Receitas Recebidas', formatarMoeda(totalRecebido)],
            ['Receitas Pendentes', formatarMoeda(totalPendente)],
            ['Despesas Pagas', formatarMoeda(totalDespesas)],
            ['Saldo do Mes', formatarMoeda(saldo)],
        ],
        headStyles: { fillColor: [30, 58, 95] },
        styles: { fontSize: 10 },
    })

    y = (doc as any).lastAutoTable.finalY + 12

    // receitas
    const receitas = dados.receitas.filter(r => r.mes === mes && r.ano === ano)
    if (receitas.length > 0) {
        doc.setFontSize(13)
        doc.setTextColor(30, 58, 95)
        doc.text('Receitas', 14, y)
        y += 8

        autoTable(doc, {
            startY: y,
            head: [['Imovel', 'Inquilino', 'Valor', 'Vencimento', 'Status']],
            body: receitas.map(r => [
                r.nomeImovel,
                r.nomeInquilino || '-',
                formatarMoeda(r.valor),
                formatarData(r.dataVencimento),
                r.status,
            ]),
            headStyles: { fillColor: [30, 58, 95] },
            styles: { fontSize: 9 },
        })

        y = (doc as any).lastAutoTable.finalY + 12
    }

    // despesas
    const despesas = dados.despesas.filter(d => d.mes === mes && d.ano === ano)
    if (despesas.length > 0) {
        if (y > 230) { doc.addPage(); y = 20 }

        doc.setFontSize(13)
        doc.setTextColor(30, 58, 95)
        doc.text('Despesas', 14, y)
        y += 8

        autoTable(doc, {
            startY: y,
            head: [['Nome', 'Categoria', 'Imovel', 'Valor', 'Vencimento', 'Status']],
            body: despesas.map(d => [
                d.nome,
                d.categoria,
                d.nomeImovel || 'Geral',
                formatarMoeda(d.valor),
                formatarData(d.dataVencimento),
                d.status,
            ]),
            headStyles: { fillColor: [30, 58, 95] },
            styles: { fontSize: 9 },
        })

        y = (doc as any).lastAutoTable.finalY + 12
    }

    // rateio
    const participantes = (dados.participantes || []).filter(p => p.ativo)
    if (participantes.length > 0) {
        if (y > 230) { doc.addPage(); y = 20 }

        const liquido = totalRecebido - totalDespesas

        doc.setFontSize(13)
        doc.setTextColor(30, 58, 95)
        doc.text('Rateio', 14, y)
        y += 8

        autoTable(doc, {
            startY: y,
            head: [['Participante', 'Percentual', 'Parte Bruta', 'Parte Despesas', 'Valor Liquido']],
            body: participantes.map(p => [
                p.nome,
                `${p.percentual}%`,
                formatarMoeda(totalRecebido * p.percentual / 100),
                formatarMoeda(totalDespesas * p.percentual / 100),
                formatarMoeda(liquido * p.percentual / 100),
            ]),
            headStyles: { fillColor: [30, 58, 95] },
            styles: { fontSize: 9 },
        })
    }

    // rodape
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(143, 160, 180)
        doc.text(
            `Via Patrimonial - Pagina ${i} de ${pageCount}`,
            14,
            doc.internal.pageSize.height - 10
        )
    }

    const periodo2 = `${String(mes).padStart(2, '0')}_${ano}`
    doc.save(`via_patrimonial_relatorio_${periodo2}.pdf`)
}

// ===== EXPORTAR PDF DO RATEIO POR PARTICIPANTE =====
export function exportarPDFParticipante(
    dados: DadosSistema,
    participanteId: string,
    mes: number,
    ano: number
) {
    const participante = (dados.participantes || []).find(p => p.id === participanteId)
    if (!participante) return

    const doc = new jsPDF()
    const periodo = nomeMes(mes, ano)

    const totalRecebido = dados.receitas
        .filter(r => r.mes === mes && r.ano === ano && r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const totalDespesas = dados.despesas
        .filter(d => d.mes === mes && d.ano === ano && d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const liquido = totalRecebido - totalDespesas
    const valorBruto = totalRecebido * participante.percentual / 100
    const valorDespesas = totalDespesas * participante.percentual / 100
    const valorLiquido = liquido * participante.percentual / 100

    // cabecalho
    doc.setFontSize(20)
    doc.setTextColor(30, 58, 95)
    doc.text('Via Patrimonial', 14, 20)
    doc.setFontSize(12)
    doc.setTextColor(90, 106, 126)
    doc.text(`Rateio de ${periodo} - ${participante.nome}`, 14, 28)

    doc.setDrawColor(228, 232, 239)
    doc.line(14, 32, 196, 32)

    autoTable(doc, {
        startY: 40,
        head: [['Descricao', 'Valor']],
        body: [
            ['Receitas totais recebidas', formatarMoeda(totalRecebido)],
            [`Sua parte bruta (${participante.percentual}%)`, formatarMoeda(valorBruto)],
            ['Despesas totais pagas', formatarMoeda(totalDespesas)],
            [`Sua parte das despesas (${participante.percentual}%)`, formatarMoeda(valorDespesas)],
            ['Seu valor liquido', formatarMoeda(valorLiquido)],
        ],
        headStyles: { fillColor: [30, 58, 95] },
        styles: { fontSize: 11 },
        columnStyles: {
            1: { halign: 'right', fontStyle: 'bold' }
        }
    })

    doc.setFontSize(8)
    doc.setTextColor(143, 160, 180)
    doc.text(
        'Via Patrimonial',
        14,
        doc.internal.pageSize.height - 10
    )

    doc.save(`rateio_${participante.nome.replace(' ', '_')}_${String(mes).padStart(2, '0')}_${ano}.pdf`)
}