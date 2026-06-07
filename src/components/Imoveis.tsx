// ===== TELA DE IMOVEIS - VIA PATRIMONIAL =====
import { useState } from 'react'
import { Building2, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { useContexto } from '../contexto'
import { Imovel, TipoImovel } from '../types'

const tiposImovel: TipoImovel[] = [
    'Casa', 'Apartamento', 'Sala Comercial', 'Loja',
    'Galpao', 'Terreno', 'Chacara', 'Predio Comercial', 'Outros'
]

const imovelVazio = {
    nome: '',
    tipo: 'Casa' as TipoImovel,
    endereco: '',
    nomeInquilino: '',
    telefoneInquilino: '',
    valorAluguel: '',
    diaVencimento: 5,
    observacoes: '',
    valorEstimado: '',
    ativo: true,
    dataInicioContrato: '',
    dataFimContrato: '',
}

function mascararTelefone(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 11)
    if (numeros.length <= 10) {
        return numeros
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
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

export default function Imoveis() {
    const { dados, adicionarImovel, editarImovel, excluirImovel } = useContexto()
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [form, setForm] = useState(imovelVazio)
    const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null)

    function abrirFormularioNovo() {
        setForm(imovelVazio)
        setEditandoId(null)
        setMostrarFormulario(true)
    }

    function abrirFormularioEdicao(imovel: Imovel) {
        setForm({
            nome: imovel.nome,
            tipo: imovel.tipo,
            endereco: imovel.endereco,
            nomeInquilino: imovel.nomeInquilino,
            telefoneInquilino: imovel.telefoneInquilino,
            valorAluguel: imovel.valorAluguel
                ? imovel.valorAluguel.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                : '',
            diaVencimento: imovel.diaVencimento,
            observacoes: imovel.observacoes,
            valorEstimado: imovel.valorEstimado
                ? imovel.valorEstimado.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                : '',
            ativo: imovel.ativo,
            dataInicioContrato: imovel.dataInicioContrato || '',
            dataFimContrato: imovel.dataFimContrato || '',
        })
        setEditandoId(imovel.id)
        setMostrarFormulario(true)
    }

    function fecharFormulario() {
        setMostrarFormulario(false)
        setEditandoId(null)
        setForm(imovelVazio)
    }

    function salvar() {
        if (!form.nome || !form.endereco) return
        const dadosSalvar = {
            ...form,
            valorAluguel: desformatarValor(String(form.valorAluguel)),
            valorEstimado: desformatarValor(String(form.valorEstimado)),
        }
        if (editandoId) {
            editarImovel(editandoId, dadosSalvar)
        } else {
            adicionarImovel(dadosSalvar)
        }
        fecharFormulario()
    }

    function excluir(id: string) {
        excluirImovel(id)
        setConfirmarExclusao(null)
    }

    const imoveis = dados.imoveis.filter(i => i.ativo)

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
                    <h1 style={{ marginBottom: '6px' }}>Imoveis</h1>
                    <p>{imoveis.length} imovel(is) cadastrado(s)</p>
                </div>
                <button className="btn-primary" onClick={abrirFormularioNovo} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={16} />
                    Novo Imovel
                </button>
            </div>

            {/* Lista */}
            {imoveis.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <Building2 size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '8px' }}>Nenhum imovel cadastrado</h3>
                    <p>Clique em "Novo Imovel" para comecar.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {imoveis.map(imovel => (
                        <div key={imovel.id} className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {/* Linha superior: icone + info + valor */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--color-pending-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                    flexShrink: 0,
                                }}>
                                    <Building2 size={22} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        color: 'var(--color-text)',
                                        marginBottom: '4px',
                                        fontSize: '1rem'
                                    }}>
                                        {imovel.nome}
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: '2px'
                                    }}>
                                        {imovel.tipo} &bull; {imovel.endereco}
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: '2px'
                                    }}>
                                        Inquilino: {imovel.nomeInquilino || 'Nao informado'} &bull; Vence dia {imovel.diaVencimento}
                                    </div>
                                    {imovel.dataInicioContrato && (
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--color-text-muted)',
                                        }}>
                                            Contrato: {new Date(imovel.dataInicioContrato + 'T12:00:00').toLocaleDateString('pt-BR')}
                                            {imovel.dataFimContrato && ` ate ${new Date(imovel.dataFimContrato + 'T12:00:00').toLocaleDateString('pt-BR')}`}
                                        </div>
                                    )}
                                </div>

                                {/* Valor */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{
                                        fontWeight: 700,
                                        color: 'var(--color-primary)',
                                        fontSize: '1rem'
                                    }}>
                                        {imovel.valorAluguel.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        por mes
                                    </div>
                                </div>
                            </div>

                            {/* Linha inferior: botoes */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: '12px'
                            }}>
                                {confirmarExclusao === imovel.id ? (
                                    <>
                                        <button
                                            className="btn-danger"
                                            onClick={() => excluir(imovel.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                        >
                                            <Check size={14} /> Confirmar exclusao
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
                                        <button
                                            className="btn-outline"
                                            onClick={() => abrirFormularioEdicao(imovel)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                        >
                                            <Pencil size={14} /> Editar
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={() => setConfirmarExclusao(imovel.id)}
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
            )}

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
                        maxWidth: '560px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                            <h2>{editandoId ? 'Editar Imovel' : 'Novo Imovel'}</h2>
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
                            <div>
                                <label>Nome do Imovel *</label>
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={e => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Casa da Rua das Flores"
                                />
                            </div>

                            <div>
                                <label>Tipo</label>
                                <select
                                    value={form.tipo}
                                    onChange={e => setForm({ ...form, tipo: e.target.value as TipoImovel })}
                                >
                                    {tiposImovel.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Endereco *</label>
                                <input
                                    type="text"
                                    value={form.endereco}
                                    onChange={e => setForm({ ...form, endereco: e.target.value })}
                                    placeholder="Ex: Rua das Flores, 123"
                                />
                            </div>

                            <div>
                                <label>Nome do Inquilino</label>
                                <input
                                    type="text"
                                    value={form.nomeInquilino}
                                    onChange={e => setForm({ ...form, nomeInquilino: e.target.value })}
                                    placeholder="Ex: Joao Silva"
                                />
                            </div>

                            <div>
                                <label>Telefone do Inquilino</label>
                                <input
                                    type="text"
                                    value={form.telefoneInquilino}
                                    onChange={e => setForm({
                                        ...form,
                                        telefoneInquilino: mascararTelefone(e.target.value)
                                    })}
                                    placeholder="(11) 99999-9999"
                                    maxLength={15}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label>Valor do Aluguel (R$)</label>
                                    <input
                                        type="text"
                                        value={form.valorAluguel}
                                        onChange={e => setForm({
                                            ...form,
                                            valorAluguel: mascararValor(e.target.value)
                                        })}
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label>Inicio do Contrato</label>
                                    <input
                                        type="date"
                                        value={form.dataInicioContrato}
                                        onChange={e => setForm({ ...form, dataInicioContrato: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Fim do Contrato</label>
                                    <input
                                        type="date"
                                        value={form.dataFimContrato}
                                        onChange={e => setForm({ ...form, dataFimContrato: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Valor Estimado do Imovel (R$) — opcional</label>
                                <input
                                    type="text"
                                    value={form.valorEstimado}
                                    onChange={e => setForm({
                                        ...form,
                                        valorEstimado: mascararValor(e.target.value)
                                    })}
                                    placeholder="0,00"
                                />
                            </div>

                            <div>
                                <label>Observacoes</label>
                                <textarea
                                    value={form.observacoes}
                                    onChange={e => setForm({ ...form, observacoes: e.target.value })}
                                    placeholder="Informacoes adicionais..."
                                    rows={3}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="btn-outline" onClick={fecharFormulario}>
                                    Cancelar
                                </button>
                                <button className="btn-primary" onClick={salvar}>
                                    {editandoId ? 'Salvar Alteracoes' : 'Cadastrar Imovel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}