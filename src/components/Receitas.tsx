// ===== TELA DE RECEITAS - VIA PATRIMONIAL =====
import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Plus, X } from 'lucide-react'
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

function mascararValor(valor: string): string {
    const numeros = valor.replace(/\D/g, '')
    if (!numeros) return ''
    const numero = Number(numeros) / 100
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function desformatarValor(valor: string): number {
    return Number(valor.replace(/\./g, '').replace(',', '.')) || 0
}

export default function Receitas() {
    const { dados, marcarReceitaRecebida, adicionarReceita } = useContexto()
    const [aba, setAba] = useState<'pendentes' | 'recebidas' | 'atrasadas'>('pendentes')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [form, setForm] = useState({
        descricao: '',
        valor: '',
        diaVencimento: 5,
        observacoes: '',
    })

    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()
    const nomeMes = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    const receitasMes = dados.receitas.filter(
        r => r.mes === mesAtual && r.ano === anoAtual
    )

    const pendentes = receitasMes.filter(
        r => r.status === 'Pendente' || r.status === 'Atrasado'
    )
    const recebidas = receitasMes.filter(r => r.status === 'Recebido')
    const atrasadas = receitasMes.filter(r => r.status === 'Atrasado')

    const totalPendente = pendentes.reduce((acc, r) => acc + r.valor, 0)
    const totalRecebido = recebidas.reduce((acc, r) => acc + r.valor, 0)
    const totalAtrasado = atrasadas.reduce((acc, r) => acc + r.valor, 0)

    function salvar() {
        if (!form.descricao || !form.valor) return

        const dataVencimento = new Date(anoAtual, mesAtual - 1, form.diaVencimento)

        adicionarReceita({
            imovelId: 'eventual',
            nomeImovel: form.descricao,
            nomeInquilino: '',
            valor: desformatarValor(form.valor),
            mes: mesAtual,
            ano: anoAtual,
            dataVencimento: dataVencimento.toISOString(),
            status: 'Pendente',
            observacoes: form.observacoes,
        })

        setMostrarFormulario(false)
        setForm({ descricao: '', valor: '', diaVencimento: 5, observacoes: '' })
    }

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

    function renderizarLista() {
        let lista = pendentes
        if (aba === 'recebidas') lista = recebidas
        if (aba === 'atrasadas') lista = atrasadas

        if (lista.length === 0) {
            return (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <TrendingUp size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '8px' }}>Nenhuma receita aqui</h3>
                    <p>Os registros aparecem conforme os imoveis forem cadastrados.</p>
                </div>
            )
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lista.map(receita => (
                    <div key={receita.id} className="card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                backgroundColor:
                                    receita.status === 'Recebido' ? 'var(--color-success-bg)' :
                                    receita.status === 'Atrasado' ? 'var(--color-danger-bg)' :
                                    'var(--color-warning-bg)',
                                color:
                                    receita.status === 'Recebido' ? 'var(--color-success)' :
                                    receita.status === 'Atrasado' ? 'var(--color-danger)' :
                                    'var(--color-warning)',
                            }}>
                                {receita.status === 'Recebido' && <CheckCircle size={20} />}
                                {receita.status === 'Atrasado' && <AlertCircle size={20} />}
                                {receita.status === 'Pendente' && <Clock size={20} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
                                    {receita.nomeImovel}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    {receita.nomeInquilino && `${receita.nomeInquilino} \u2022 `}
                                    Vence: {formatarData(receita.dataVencimento)}
                                </div>
                                {receita.dataRecebimento && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '2px' }}>
                                        Recebido em: {formatarData(receita.dataRecebimento)}
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    color: 'var(--color-primary)',
                                    marginBottom: '4px'
                                }}>
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

                        {receita.status !== 'Recebido' && (
                            <button
                                className="btn-primary"
                                onClick={() => marcarReceitaRecebida(receita.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexShrink: 0,
                                    fontSize: '0.85rem',
                                    padding: '8px 14px'
                                }}
                            >
                                <CheckCircle size={14} />
                                Recebido
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            {/* Cabecalho */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{ marginBottom: '6px' }}>Receitas</h1>
                    <p style={{ textTransform: 'capitalize' }}>{nomeMes}</p>
                </div>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={16} />
                    Nova Receita
                </button>
            </div>

            {/* Resumo */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Pendente</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-warning)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalPendente)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Recebido</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalRecebido)}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Atrasado</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalAtrasado)}
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
                <button style={estiloAba(aba === 'pendentes')} onClick={() => setAba('pendentes')}>
                    Pendentes ({pendentes.length})
                </button>
                <button style={estiloAba(aba === 'recebidas')} onClick={() => setAba('recebidas')}>
                    Recebidas ({recebidas.length})
                </button>
                <button style={estiloAba(aba === 'atrasadas')} onClick={() => setAba('atrasadas')}>
                    Atrasadas ({atrasadas.length})
                </button>
            </div>

            {/* Lista */}
            {renderizarLista()}

            {/* Formulario — Receita Eventual */}
            {mostrarFormulario && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '480px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                            <h2>Nova Receita Eventual</h2>
                            <button onClick={() => setMostrarFormulario(false)} style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                cursor: 'pointer'
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label>Descricao *</label>
                                <input
                                    type="text"
                                    value={form.descricao}
                                    onChange={e => setForm({ ...form, descricao: e.target.value })}
                                    placeholder="Ex: Reembolso de manutencao"
                                />
                            </div>

                            <div>
                                <label>Valor (R$) *</label>
                                <input
                                    type="text"
                                    value={form.valor}
                                    onChange={e => setForm({ ...form, valor: mascararValor(e.target.value) })}
                                    placeholder="0,00"
                                />
                            </div>

                            <div>
                                <label>Dia de Vencimento</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={31}
                                    value={form.diaVencimento}
                                    onChange={e => setForm({ ...form, diaVencimento: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label>Observacoes</label>
                                <textarea
                                    value={form.observacoes}
                                    onChange={e => setForm({ ...form, observacoes: e.target.value })}
                                    placeholder="Informacoes adicionais..."
                                    rows={2}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="btn-outline" onClick={() => setMostrarFormulario(false)}>
                                    Cancelar
                                </button>
                                <button className="btn-primary" onClick={salvar}>
                                    Cadastrar Receita
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}