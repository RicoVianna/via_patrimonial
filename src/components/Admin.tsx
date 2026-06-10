// ===== AREA ADMINISTRATIVA - VIA PATRIMONIAL =====
import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, Lock, Download, Upload } from 'lucide-react'
import { useContexto } from '../contexto'
import { Participante } from '../types'
import { exportarBackup, importarBackup } from '../storage'
import { exportarExcel, exportarPDFMensal } from '../exportar'

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
    const { dados, adicionarParticipante, editarParticipante, excluirParticipante, atualizarDados } = useContexto()
    const [autenticado, setAutenticado] = useState(false)
    const [senhaDigitada, setSenhaDigitada] = useState('')
    const [erroSenha, setErroSenha] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null)
    const [form, setForm] = useState(participanteVazio)
    const [mensagemBackup, setMensagemBackup] = useState('')
    const inputArquivoRef = useRef<HTMLInputElement>(null)

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

    function handleExportarBackup() {
        exportarBackup(dados)
        setMensagemBackup('Backup exportado com sucesso!')
        setTimeout(() => setMensagemBackup(''), 3000)
    }

    async function handleImportarBackup(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return
        try {
            const dadosImportados = await importarBackup(arquivo)
            atualizarDados(dadosImportados)
            setMensagemBackup('Backup importado com sucesso!')
            setTimeout(() => setMensagemBackup(''), 3000)
        } catch {
            setMensagemBackup('Erro ao importar backup. Verifique o arquivo.')
            setTimeout(() => setMensagemBackup(''), 3000)
        }
        if (inputArquivoRef.current) inputArquivoRef.current.value = ''
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
                <div style={{ position: 'relative' }}>
                    <input
                        type={mostrarSenha ? 'text' : 'password'}
                        value={senhaDigitada}
                        onChange={e => {
                            setSenhaDigitada(e.target.value)
                            setErroSenha(false)
                        }}
                        onKeyDown={e => e.key === 'Enter' && entrar()}
                        placeholder="Senha"
                        style={{
                            borderColor: erroSenha ? 'var(--color-danger)' : undefined,
                            paddingRight: '44px',
                        }}
                    />
                    <button
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            padding: 0,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {mostrarSenha ? '🙈' : '👁️'}
                    </button>
                </div>
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
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '6px' }}>Area Administrativa</h1>
                <p>Gerencie participantes e dados do sistema</p>
            </div>

            {/* Secao de Backup */}
            <div className="card" style={{ marginBottom: '32px' }}>
                <h2 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Relatorios</h2>

                {mensagemBackup && (
                    <div style={{
                        backgroundColor: mensagemBackup.includes('Erro')
                            ? 'var(--color-danger-bg)'
                            : 'var(--color-success-bg)',
                        color: mensagemBackup.includes('Erro')
                            ? 'var(--color-danger)'
                            : 'var(--color-success)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '16px',
                        fontSize: '0.9rem'
                    }}>
                        {mensagemBackup}
                    </div>
                )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    className="btn-primary"
                    onClick={() => exportarPDFMensal(dados, new Date().getMonth() + 1, new Date().getFullYear())}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Download size={16} />
                    Exportar PDF
                </button>

                <button
                    className="btn-outline"
                    onClick={() => exportarExcel(dados, new Date().getMonth() + 1, new Date().getFullYear())}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Download size={16} />
                    Exportar Excel
                </button>
            </div>

            <h2 style={{ marginBottom: '16px', marginTop: '24px', fontSize: '1.1rem' }}>Backup e Restauracao</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    className="btn-primary"
                    onClick={handleExportarBackup}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Download size={16} />
                    Exportar Backup
                </button>

                <button
                    className="btn-outline"
                    onClick={() => inputArquivoRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Upload size={16} />
                    Importar Backup
                </button>

                <input
                    ref={inputArquivoRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportarBackup}
                    style={{ display: 'none' }}
                />
            </div>
            </div>

            {/* Secao de Participantes */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <h2 style={{ fontSize: '1.1rem' }}>Participantes do Rateio</h2>
                <button className="btn-primary" onClick={abrirFormularioNovo} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={16} />
                    Novo
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
                    marginBottom: '16px',
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
                    <p>Clique em "Novo" para comecar.</p>
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
                                    step={0.01}
                                    value={form.percentual || ''}
                                    onChange={e => setForm({ ...form, percentual: Number(e.target.value) })}
                                    placeholder="Ex: 16.67"
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