// ===== TELA DE HISTORICO - VIA PATRIMONIAL =====
import { useState } from 'react'
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useContexto } from '../contexto'

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

function formatarData(dataISO: string): string {
    return new Date(dataISO).toLocaleDateString('pt-BR')
}

const nomeMeses = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function Historico() {
    const { dados } = useContexto()

    const agora = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth() + 1)
    const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear())
    const [aba, setAba] = useState<'receitas' | 'despesas'>('receitas')

    // Anos disponiveis baseado nos registros existentes
    const anosDisponiveis = Array.from(new Set([
        ...dados.receitas.map(r => r.ano),
        ...dados.despesas.map(d => d.ano),
        agora.getFullYear()
    ])).sort((a, b) => b - a)

    // Filtra registros do periodo selecionado
    const receitasPeriodo = dados.receitas.filter(
        r => r.mes === mesSelecionado && r.ano === anoSelecionado
    )
    const despesasPeriodo = dados.despesas.filter(
        d => d.mes === mesSelecionado && d.ano === anoSelecionado
    )

    // Calculos do periodo
    const totalRecebido = receitasPeriodo
        .filter(r => r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const totalAtrasadoReceitas = receitasPeriodo
        .filter(r => r.status === 'Atrasado')
        .reduce((acc, r) => acc + r.valor, 0)
    const totalPago = despesasPeriodo
        .filter(d => d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const totalAtrasadoDespesas = despesasPeriodo
        .filter(d => d.status === 'Atrasado')
        .reduce((acc, d) => acc + d.valor, 0)
    const saldo = totalRecebido - totalPago

    const estiloAba = (ativa: boolean) => ({
        padding: '10px 20px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        fontWeight: ativa ? 600 : 400,
        backgroundColor: ativa ? 'var(--color-primary)' : 'transparent',
        color: ativa ? 'white' : 'var(--color-text-secondary)',
        transition: 'all 0.2s ease',
    })

    return (
        <div>
            {/* Cabecalho */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '6px' }}>Historico</h1>
                <p>Consulte receitas e despesas por periodo</p>
            </div>

            {/* Filtros de periodo */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '28px',
                flexWrap: 'wrap'
            }}>
                <div>
                    <label>Mes</label>
                    <select
                        value={mesSelecionado}
                        onChange={e => setMesSelecionado(Number(e.target.value))}
                        style={{ width: 'auto', minWidth: '140px' }}
                    >
                        {nomeMeses.map((nome, index) => (
                            <option key={index + 1} value={index + 1}>{nome}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Ano</label>
                    <select
                        value={anoSelecionado}
                        onChange={e => setAnoSelecionado(Number(e.target.value))}
                        style={{ width: 'auto', minWidth: '100px' }}
                    >
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resumo do periodo */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Recebido</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalRecebido)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Receitas Atrasadas</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalAtrasadoReceitas)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Pago</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalPago)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Despesas Atrasadas</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalAtrasadoDespesas)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Saldo do Periodo</p>
                    <div style={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: saldo >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {formatarMoeda(saldo)}
                    </div>
                </div>
            </div>

            {/* Abas */}
            <div style={{
                display: 'flex',
                gap: '4px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px',
                marginBottom: '20px',
                width: 'fit-content'
            }}>
                <button style={estiloAba(aba === 'receitas')} onClick={() => setAba('receitas')}>
                    Receitas ({receitasPeriodo.length})
                </button>
                <button style={estiloAba(aba === 'despesas')} onClick={() => setAba('despesas')}>
                    Despesas ({despesasPeriodo.length})
                </button>
            </div>

            {/* Lista de receitas */}
            {aba === 'receitas' && (
                <div>
                    {receitasPeriodo.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                            <TrendingUp size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                            <h3 style={{ marginBottom: '8px' }}>Nenhuma receita neste periodo</h3>
                            <p>Selecione outro mes ou ano.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {receitasPeriodo.map(receita => (
                                <div key={receita.id} className="card" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        backgroundColor: receita.status === 'Recebido'
                                            ? 'var(--color-success-bg)'
                                            : 'var(--color-danger-bg)',
                                        color: receita.status === 'Recebido'
                                            ? 'var(--color-success)'
                                            : 'var(--color-danger)',
                                    }}>
                                        {receita.status === 'Recebido'
                                            ? <CheckCircle size={20} />
                                            : <AlertCircle size={20} />
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                            {receita.nomeImovel}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {receita.nomeInquilino} &bull; Vencimento: {formatarData(receita.dataVencimento)}
                                        </div>
                                        {receita.dataRecebimento && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '2px' }}>
                                                Recebido em: {formatarData(receita.dataRecebimento)}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {formatarMoeda(receita.valor)}
                                        </div>
                                        <span className={
                                            receita.status === 'Recebido' ? 'badge badge-success' :
                                            receita.status === 'Atrasado' ? 'badge badge-danger' :
                                            'badge badge-warning'
                                        }>
                                            {receita.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Lista de despesas */}
            {aba === 'despesas' && (
                <div>
                    {despesasPeriodo.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                            <TrendingDown size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                            <h3 style={{ marginBottom: '8px' }}>Nenhuma despesa neste periodo</h3>
                            <p>Selecione outro mes ou ano.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {despesasPeriodo.map(despesa => (
                                <div key={despesa.id} className="card" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        backgroundColor: despesa.status === 'Pago'
                                            ? 'var(--color-success-bg)'
                                            : 'var(--color-danger-bg)',
                                        color: despesa.status === 'Pago'
                                            ? 'var(--color-success)'
                                            : 'var(--color-danger)',
                                    }}>
                                        {despesa.status === 'Pago'
                                            ? <CheckCircle size={20} />
                                            : <AlertCircle size={20} />
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                            {despesa.nome}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {despesa.categoria} &bull; Vencimento: {formatarData(despesa.dataVencimento)}
                                        </div>
                                        {despesa.dataPagamento && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '2px' }}>
                                                Pago em: {formatarData(despesa.dataPagamento)}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {formatarMoeda(despesa.valor)}
                                        </div>
                                        <span className={
                                            despesa.status === 'Pago' ? 'badge badge-success' :
                                            despesa.status === 'Atrasado' ? 'badge badge-danger' :
                                            'badge badge-warning'
                                        }>
                                            {despesa.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}