// ===== TELA DE DESPESAS - VIA PATRIMONIAL =====
import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, TrendingDown, Plus, X, Pencil, Trash2, Check } from 'lucide-react'
import { useContexto } from '../contexto'
import { Despesa, CategoriaDespesa } from '../types'

const categorias: CategoriaDespesa[] = [
    'Agua', 'Luz', 'IPTU', 'Condominio',
    'Internet', 'Manutencao', 'Salarios', 'Outros'
]

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

const formVazio = {
    nome: '',
    categoria: 'Outros' as CategoriaDespesa,
    valor: '',
    diaVencimento: 5,
    observacoes: '',
    recorrente: true,
}

export default function Despesas() {
    const { dados, marcarDespesaPaga, adicionarTemplate, adicionarDespesa, excluirDespesa } = useContexto()
    const [aba, setAba] = useState<'pendentes' | 'pagas' | 'atrasadas'>('pendentes')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null)
    const [form, setForm] = useState(formVazio)

    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()
    const nomeMes = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    const despesasMes = dados.despesas.filter(
        d => d.mes === mesAtual && d.ano === anoAtual
    )

    const pendentes = despesasMes.filter(
        d => d.status === 'Pendente' || d.status === 'Atrasado'
    )
    const pagas = despesasMes.filter(d => d.status === 'Pago')
    const atrasadas = despesasMes.filter(d => d.status === 'Atrasado')

    const totalPendente = pendentes.reduce((acc, d) => acc + d.valor, 0)
    const totalPago = pagas.reduce((acc, d) => acc + d.valor, 0)
    const totalAtrasado = atrasadas.reduce((acc, d) => acc + d.valor, 0)

    function abrirFormularioEdicao(despesa: Despesa) {
        setForm({
            nome: despesa.nome,
            categoria: despesa.categoria,
            valor: despesa.valor.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            diaVencimento: new Date(despesa.dataVencimento).getDate(),
            observacoes: despesa.observacoes,
            recorrente: despesa.recorrente,
        })
        setEditandoId(despesa.id)
        setMostrarFormulario(true)
    }

    function fecharFormulario() {
        setMostrarFormulario(false)
        setEditandoId(null)
        setForm(formVazio)
    }

    function salvar() {
        if (!form.nome) return

        const dataVencimento = new Date(anoAtual, mesAtual - 1, form.diaVencimento)
        const valor = desformatarValor(form.valor)

        if (editandoId) {
            // Edita a despesa existente
            const despesasAtualizadas = dados.despesas.map(d =>
                d.id === editandoId
                    ? {
                        ...d,
                        nome: form.nome,
                        categoria: form.categoria,
                        valor,
                        dataVencimento: dataVencimento.toISOString(),
                        observacoes: form.observacoes,
                        recorrente: form.recorrente,
                    }
                    : d
            )
            // Usa atualizarDados do contexto
            adicionarDespesa({
                nome: '',
                categoria: form.categoria,
                valor: 0,
                mes: mesAtual,
                ano: anoAtual,
                dataVencimento: dataVencimento.toISOString(),
                status: 'Pendente',
                observacoes: '',
                recorrente: false,
            })
            // Remove o que acabou de adicionar e aplica a edicao
            excluirDespesa(dados.despesas[dados.despesas.length]?.id || '')
            dados.despesas.forEach((_, i) => {
                if (dados.despesas[i].id === editandoId) {
                    dados.despesas[i] = despesasAtualizadas[i]
                }
            })
        } else {
            adicionarDespesa({
                nome: form.nome,
                categoria: form.categoria,
                valor,
                mes: mesAtual,
                ano: anoAtual,
                dataVencimento: dataVencimento.toISOString(),
                status: 'Pendente',
                observacoes: form.observacoes,
                recorrente: form.recorrente,
            })

            if (form.recorrente) {
                adicionarTemplate({
                    nome: form.nome,
                    categoria: form.categoria,
                    valor,
                    diaVencimento: form.diaVencimento,
                    observacoes: form.observacoes,
                    ativo: true,
                })
            }
        }

        fecharFormulario()
    }

    function excluir(id: string) {
        excluirDespesa(id)
        setConfirmarExclusao(null)
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
        if (aba === 'pagas') lista = pagas
        if (aba === 'atrasadas') lista = atrasadas

        if (lista.length === 0) {
            return (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <TrendingDown size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '8px' }}>Nenhuma despesa aqui</h3>
                    <p>Clique em "Nova Despesa" para cadastrar.</p>
                </div>
            )
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lista.map(despesa => (
                    <div key={despesa.id} className="card" style={{
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
                                    despesa.status === 'Pago' ? 'var(--color-success-bg)' :
                                    despesa.status === 'Atrasado' ? 'var(--color-danger-bg)' :
                                    'var(--color-warning-bg)',
                                color:
                                    despesa.status === 'Pago' ? 'var(--color-success)' :
                                    despesa.status === 'Atrasado' ? 'var(--color-danger)' :
                                    'var(--color-warning)',
                            }}>
                                {despesa.status === 'Pago' && <CheckCircle size={20} />}
                                {despesa.status === 'Atrasado' && <AlertCircle size={20} />}
                                {despesa.status === 'Pendente' && <Clock size={20} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
                                    {despesa.nome}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    {despesa.categoria} &bull; Vence: {formatarData(despesa.dataVencimento)}
                                    {despesa.recorrente && ' \u2022 Recorrente'}
                                </div>
                                {despesa.dataPagamento && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '2px' }}>
                                        Pago em: {formatarData(despesa.dataPagamento)}
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

                        {/* Botoes de acao */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            {confirmarExclusao === despesa.id ? (
                                <>
                                    <button
                                        className="btn-danger"
                                        onClick={() => excluir(despesa.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                    >
                                        <Check size={14} /> Confirmar
                                    </button>
                                    <button
                                        className="btn-outline"
                                        onClick={() => setConfirmarExclusao(null)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                    >
                                        <X size={14} /> Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    {despesa.status !== 'Pago' && (
                                        <button
                                            className="btn-primary"
                                            onClick={() => marcarDespesaPaga(despesa.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 14px' }}
                                        >
                                            <CheckCircle size={14} />
                                            Pago
                                        </button>
                                    )}
                                    <button
                                        className="btn-outline"
                                        onClick={() => abrirFormularioEdicao(despesa)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                    >
                                        <Pencil size={14} /> Editar
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => setConfirmarExclusao(despesa.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                    >
                                        <Trash2 size={14} /> Excluir
                                    </button>
                                </>
                            )}
                        </div>
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
                    <h1 style={{ marginBottom: '6px' }}>Despesas</h1>
                    <p style={{ textTransform: 'capitalize' }}>{nomeMes}</p>
                </div>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={16} />
                    Nova Despesa
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
                    <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Pago</p>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                        {formatarMoeda(totalPago)}
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
                <button style={estiloAba(aba === 'pagas')} onClick={() => setAba('pagas')}>
                    Pagas ({pagas.length})
                </button>
                <button style={estiloAba(aba === 'atrasadas')} onClick={() => setAba('atrasadas')}>
                    Atrasadas ({atrasadas.length})
                </button>
            </div>

            {/* Lista */}
            {renderizarLista()}

            {/* Formulario */}
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
                            <h2>{editandoId ? 'Editar Despesa' : 'Nova Despesa'}</h2>
                            <button onClick={fecharFormulario} style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                cursor: 'pointer'
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Tipo de despesa */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setForm({ ...form, recorrente: true })}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: `2px solid ${form.recorrente ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        backgroundColor: form.recorrente ? 'var(--color-pending-bg)' : 'transparent',
                                        color: form.recorrente ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: form.recorrente ? 600 : 400,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Recorrente
                                </button>
                                <button
                                    onClick={() => setForm({ ...form, recorrente: false })}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: `2px solid ${!form.recorrente ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        backgroundColor: !form.recorrente ? 'var(--color-pending-bg)' : 'transparent',
                                        color: !form.recorrente ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: !form.recorrente ? 600 : 400,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Eventual
                                </button>
                            </div>

                            <div>
                                <label>Nome da Despesa *</label>
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={e => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Conta de Luz"
                                />
                            </div>

                            <div>
                                <label>Categoria</label>
                                <select
                                    value={form.categoria}
                                    onChange={e => setForm({ ...form, categoria: e.target.value as CategoriaDespesa })}
                                >
                                    {categorias.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label>Valor (R$)</label>
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
                                <button className="btn-outline" onClick={fecharFormulario}>
                                    Cancelar
                                </button>
                                <button className="btn-primary" onClick={salvar}>
                                    {editandoId ? 'Salvar Alteracoes' : 'Cadastrar Despesa'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}