// ===== TELA DE RATEIO - VIA PATRIMONIAL =====
import { useContexto } from '../contexto'
import { exportarPDFParticipante } from '../exportar'

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

export default function Rateio() {
    const { dados } = useContexto()

    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()
    const nomeMes = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    const participantes = dados.participantes || []

    // Totais do mes
    const totalRecebido = dados.receitas
        .filter(r => r.mes === mesAtual && r.ano === anoAtual && r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)

    const totalDespesas = dados.despesas
        .filter(d => d.mes === mesAtual && d.ano === anoAtual && d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)

    const liquido = totalRecebido - totalDespesas

    const somaPercentuais = participantes
        .filter(p => p.ativo)
        .reduce((acc, p) => acc + p.percentual, 0)

    function compartilharWhatsApp(participante: typeof participantes[0], valorBruto: number, valorDespesas: number, valorLiquido: number) {
        const mensagem = encodeURIComponent(
            `Ola ${participante.nome}! Segue o seu rateio de ${nomeMes}:\n\n` +
            `Receitas recebidas: ${formatarMoeda(totalRecebido)}\n` +
            `Sua parte bruta (${participante.percentual}%): ${formatarMoeda(valorBruto)}\n\n` +
            `Despesas pagas: ${formatarMoeda(totalDespesas)}\n` +
            `Sua parte das despesas (${participante.percentual}%): ${formatarMoeda(valorDespesas)}\n\n` +
            `Seu valor liquido: ${formatarMoeda(valorLiquido)}\n\n` +
            `Via Patrimonial`
        )
        const numero = participante.whatsapp.replace(/\D/g, '')
        window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank')
    }

    function compartilharEmail(participante: typeof participantes[0], valorBruto: number, valorDespesas: number, valorLiquido: number) {
        const assunto = encodeURIComponent(`Rateio - ${nomeMes}`)
        const corpo = encodeURIComponent(
            `Ola ${participante.nome},\n\n` +
            `Segue o seu rateio referente a ${nomeMes}:\n\n` +
            `Receitas recebidas: ${formatarMoeda(totalRecebido)}\n` +
            `Sua parte bruta (${participante.percentual}%): ${formatarMoeda(valorBruto)}\n\n` +
            `Despesas pagas: ${formatarMoeda(totalDespesas)}\n` +
            `Sua parte das despesas (${participante.percentual}%): ${formatarMoeda(valorDespesas)}\n\n` +
            `Seu valor liquido: ${formatarMoeda(valorLiquido)}\n\n` +
            `Via Patrimonial`
        )
        window.open(`mailto:${participante.email}?subject=${assunto}&body=${corpo}`, '_blank')
    }

    return (
        <div>
            {/* Cabecalho */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '6px' }}>Rateio</h1>
                <p style={{ textTransform: 'capitalize' }}>{nomeMes}</p>
            </div>

            {/* Resumo financeiro */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '32px'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Receitas Recebidas</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalRecebido)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Despesas Pagas</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalDespesas)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Liquido para Rateio</p>
                    <div style={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: liquido >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {formatarMoeda(liquido)}
                    </div>
                </div>
            </div>

            {/* Aviso de percentual */}
            {participantes.filter(p => p.ativo).length > 0 && somaPercentuais !== 100 && (
                <div style={{
                    backgroundColor: 'var(--color-warning-bg)',
                    border: '1px solid var(--color-warning)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    color: 'var(--color-warning)',
                    fontSize: '0.9rem'
                }}>
                    Atencao: os percentuais somam {somaPercentuais}% em vez de 100%.
                    Acesse a area administrativa para corrigir.
                </div>
            )}

            {/* Lista de participantes */}
            {participantes.filter(p => p.ativo).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <h3 style={{ marginBottom: '8px' }}>Nenhum participante cadastrado</h3>
                    <p>Acesse a area administrativa para cadastrar os participantes do rateio.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {participantes.filter(p => p.ativo).map(participante => {
                        const valorBruto = totalRecebido * (participante.percentual / 100)
                        const valorDespesas = totalDespesas * (participante.percentual / 100)
                        const valorLiquido = liquido * (participante.percentual / 100)

                        return (
                            <div key={participante.id} className="card" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {/* Cabecalho do card */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-pending-bg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        flexShrink: 0,
                                        fontFamily: 'var(--font-display)'
                                    }}>
                                        {participante.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>
                                            {participante.nome}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {participante.percentual}% de participacao
                                        </div>
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        color: valorLiquido >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                                        textAlign: 'right'
                                    }}>
                                        {formatarMoeda(valorLiquido)}
                                    </div>
                                </div>

                                {/* Detalhamento */}
                                <div style={{
                                    backgroundColor: 'var(--color-surface-2)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>Parte bruta das receitas</span>
                                        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                                            {formatarMoeda(valorBruto)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>Parte das despesas</span>
                                        <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
                                            - {formatarMoeda(valorDespesas)}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        borderTop: '1px solid var(--color-border)',
                                        paddingTop: '6px',
                                        marginTop: '2px'
                                    }}>
                                        <span style={{ color: 'var(--color-text)' }}>Valor liquido</span>
                                        <span style={{ color: valorLiquido >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            {formatarMoeda(valorLiquido)}
                                        </span>
                                    </div>
                                </div>

                                {/* Botoes de compartilhar */}
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap',
                                    borderTop: '1px solid var(--color-border)',
                                    paddingTop: '12px'
                                }}>
                                    <button
                                        className="btn-outline"
                                        onClick={() => exportarPDFParticipante(dados, participante.id, mesAtual, anoAtual)}
                                        style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                    >
                                        Gerar PDF
                                    </button>
                                    {participante.whatsapp && (
                                        <button
                                            className="btn-primary"
                                            onClick={() => compartilharWhatsApp(participante, valorBruto, valorDespesas, valorLiquido)}
                                            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                        >
                                            WhatsApp
                                        </button>
                                    )}
                                    {participante.email && (
                                        <button
                                            className="btn-outline"
                                            onClick={() => compartilharEmail(participante, valorBruto, valorDespesas, valorLiquido)}
                                            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                        >
                                            Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}