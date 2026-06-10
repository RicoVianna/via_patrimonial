// ===== LOGIN - VIA PATRIMONIAL =====
import { useState } from 'react'

const SENHA_SISTEMA = 'admin'

interface LoginProps {
    onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)

    function handleLogin() {
        if (!senha) return
        setCarregando(true)
        setErro(false)

        setTimeout(() => {
            if (senha === SENHA_SISTEMA) {
                onLogin()
            } else {
                setErro(true)
                setCarregando(false)
            }
        }, 800)
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a1628 0%, #0f2444 40%, #0a1628 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'var(--font-body)',
        }}>
            {/* Fundo */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(30, 58, 95, 0.3) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
            }} />

            {/* Card */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '48px 40px',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img
                        src="/hero_section.png"
                        alt="Via Patrimonial"
                        style={{
                            width: '72px',
                            height: '72px',
                            objectFit: 'cover',
                            objectPosition: 'center 15%',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    />
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        color: 'white',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        marginBottom: '6px',
                        lineHeight: 1.2,
                    }}>
                        Via Patrimonial
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '0.9rem',
                        margin: 0,
                    }}>
                        Acesse sua conta
                    </p>
                </div>

                {/* Campos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            marginBottom: '8px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            Senha
                        </label>

                        {/* Input com olhinho */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                value={senha}
                                onChange={e => {
                                    setSenha(e.target.value)
                                    setErro(false)
                                }}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                placeholder="Digite sua senha"
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 16px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${erro ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => {
                                    e.target.style.border = '1px solid rgba(34, 197, 94, 0.5)'
                                    e.target.style.background = 'rgba(255,255,255,0.08)'
                                }}
                                onBlur={e => {
                                    e.target.style.border = erro
                                        ? '1px solid rgba(239, 68, 68, 0.6)'
                                        : '1px solid rgba(255,255,255,0.1)'
                                    e.target.style.background = 'rgba(255,255,255,0.06)'
                                }}
                            />
                            <button
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.4)',
                                    padding: 0,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {mostrarSenha ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {erro && (
                            <p style={{
                                color: 'rgba(239, 68, 68, 0.9)',
                                fontSize: '0.82rem',
                                margin: '8px 0 0',
                            }}>
                                Senha incorreta. Tente novamente.
                            </p>
                        )}
                    </div>

                    {/* Lembrar-me */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '0.85rem',
                        }}>
                            <input
                                type="checkbox"
                                style={{ width: 'auto', accentColor: '#22c55e' }}
                            />
                            Lembrar-me
                        </label>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(34, 197, 94, 0.8)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            padding: 0,
                        }}>
                            Esqueci minha senha
                        </button>
                    </div>
                </div>

                {/* Botao entrar */}
                <button
                    onClick={handleLogin}
                    disabled={carregando}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: carregando
                            ? 'rgba(34, 197, 94, 0.4)'
                            : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        cursor: carregando ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.05em',
                        boxShadow: carregando ? 'none' : '0 4px 20px rgba(34, 197, 94, 0.3)',
                    }}
                    onMouseEnter={e => {
                        if (!carregando) {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow = '0 8px 28px rgba(34, 197, 94, 0.4)'
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)'
                    }}
                >
                    {carregando ? 'Verificando...' : 'Entrar'}
                </button>

                <p style={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '0.75rem',
                    marginTop: '32px',
                    marginBottom: 0,
                }}>
                    Via Patrimonial &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}