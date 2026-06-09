// ===== AREA ADMINISTRATIVA - VIA PATRIMONIAL =====
import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Lock } from 'lucide-react'
import { useContexto } from '../contexto'
import { Participante } from '../types'

const SENHA_ADMIN = 'admin'

const participanteVazio = {
    nome: '',
    percentual: 0,
    whatsapp: '',
    email: '',
    ativo: true,
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

export default function Admin() {
    const { dados, adicionarParticipante, editarParticipante, excluirParticipante } = useContexto()
    const [autenticado, setAutenticado] = useState(false)
    const [senhaDigitada, setSenhaDigitada] = useState('')
    const [erroSenha, setErroSenha] = useState(false)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null)
    const [form, setForm] = useState(participanteVazio)

    const participantes = dados.participantes || []
    const somaPercentuais = participantes
        .filter(p => p.ativo)
        .reduce((acc, p) => acc + p.percentual, 0)

    function entrar() {
        if (senhaDigitada === SENHA_ADMIN) {
            setAutenticado(true)
            setErroSenha(false)
        } else {
            setErroSenha(true)
        }
    }

    function abrirFormularioNovo() {
        setForm(participanteVazio)
        setEditandoId(null)
        setMostrarFormulario(true)
    }

    function abrirFormularioEdicao(participante: Participante) {
        setForm({
            nome: participante.nome,
            percentual: participante.percentual,
            whatsapp: participante.whatsapp,
            email: participante.email,
            ativo: participante.ativo,
        })
        setEditandoId(participante.id)
        setMostrarFormulario(true)
    }

    function fecharFormulario() {
        setMostrarFormulario(false)
        setEditandoId(null)
        setForm(participanteVazio)
    }

    function salvar() {
        if (!form.nome || form.percentual <= 0) return
        if (editandoId) {
            editarParticipante(editandoId, form)
        } else {
            adicionarParticipante(form)
        }
        fecharFormulario()
    }

    function excluir(id: string) {
        excluirParticipante(id)
        setConfirmarExclusao(null)
    }

    // ===== TELA DE LOGIN =====
    if (!autenticado) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '24px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-pending-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                }}>
                    <Lock size={28} />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '8px' }}>Area Administrativa</h1>
                    <p>Digite a senha para acessar</p>
                </div>

                <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="password"
                        value={senhaDigitada}
                        onChange={e => {
                            setSenhaDigitada(e.target.value)
                            setErroSenha(false)
                        }}
                        onKeyDown={e => e.key === 'Enter' && entrar()}
                        placeholder="Senha"
                        style={{
                            borderColor: erroSenha ? 'var(--color-danger)' : undefined
                        }}
                    />
                    {erroSenha && (
                        <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: 0 }}>
                            Senha incorreta. Tente novamente.
                        </p>
                    )}
                    <button className="btn-primary" onClick={entrar}>
                        Entrar
                    </button>
                </div>
            </div>
        )
    }

    // ===== AREA ADMINISTRATIVA =====
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
                    <h1 style={{ marginBottom: '6px' }}>Participantes do Rateio</h1>
                    <p>Gerencie os participantes e seus percentuais</p>
                </div>
                <button className="btn-primary" onClick={abrirFormularioNovo} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={16} />
                    Novo Participante
                </button>
            </div>

            {/* Aviso de percentual */}
            {participantes.filter(p => p.ativo).length > 0 && (
                <div style={{
                    backgroundColor: somaPercentuais === 100
                        ? 'var(--color-success-bg)'
                        : 'var(--color-warning-bg)',
                    border: `1px solid ${somaPercentuais === 100
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    color: somaPercentuais === 100
                        ? 'var(--color-success)'
                        : 'var(--color-warning)',
                    fontSize: '0.9rem',
                    fontWeight: 500
                }}>
                    {somaPercentuais === 100
                        ? 'Percentuais corretos: somam 100%'
                        : `Atencao: percentuais somam ${somaPercentuais}% (precisam somar 100%)`
                    }
                </div>
            )}

            {/* Lista de participantes */}
            {participantes.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <h3 style={{ marginBottom: '8px' }}>Nenhum participante cadastrado</h3>
                    <p>Clique em "Novo Participante" para comecar.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {participantes.map(participante => (
                        <div key={participante.id} className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    backgroundColor: participante.ativo
                                        ? 'var(--color-pending-bg)'
                                        : 'var(--color-surface-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: participante.ativo
                                        ? 'var(--color-primary)'
                                        : 'var(--color-text-muted)',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                    fontFamily: 'var(--font-display)'
                                }}>
                                    {participante.nome.charAt(0).toUpperCase()}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        color: participante.ativo
                                            ? 'var(--color-text)'
                                            : 'var(--color-text-muted)',
                                        marginBottom: '4px'
                                    }}>
                                        {participante.nome}
                                        {!participante.ativo && (
                                            <span style={{
                                                marginLeft: '8px',
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                fontWeight: 400
                                            }}>
                                                (inativo)
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                        {participante.percentual}% do rateio
                                        {participante.whatsapp && ` \u2022 ${participante.whatsapp}`}
                                    </div>
                                    {participante.email && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {participante.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botoes */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: '12px'
                            }}>
                                {confirmarExclusao === participante.id ? (
                                    <>
                                        <button
                                            className="btn-danger"
                                            onClick={() => excluir(participante.id)}
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
                                        <button
                                            className="btn-outline"
                                            onClick={() => abrirFormularioEdicao(participante)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                                        >
                                            <Pencil size={14} /> Editar
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={() => setConfirmarExclusao(participante.id)}
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
                            <h2>{editandoId ? 'Editar Participante' : 'Novo Participante'}</h2>
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
                                <label>Nome *</label>
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={e => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Joao Silva"
                                />
                            </div>

                            <div>
                                <label>Percentual (%) *</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.percentual}
                                    onChange={e => setForm({ ...form, percentual: Number(e.target.value) })}
                                    placeholder="Ex: 25"
                                />
                            </div>

                            <div>
                                <label>WhatsApp</label>
                                <input
                                    type="text"
                                    value={form.whatsapp}
                                    onChange={e => setForm({
                                        ...form,
                                        whatsapp: mascararTelefone(e.target.value)
                                    })}
                                    placeholder="(11) 99999-9999"
                                    maxLength={15}
                                />
                            </div>

                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="exemplo@email.com"
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="ativo"
                                    checked={form.ativo}
                                    onChange={e => setForm({ ...form, ativo: e.target.checked })}
                                    style={{ width: 'auto' }}
                                />
                                <label htmlFor="ativo" style={{ marginBottom: 0, cursor: 'pointer' }}>
                                    Participante ativo
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="btn-outline" onClick={fecharFormulario}>
                                    Cancelar
                                </button>
                                <button className="btn-primary" onClick={salvar}>
                                    {editandoId ? 'Salvar Alteracoes' : 'Cadastrar Participante'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}