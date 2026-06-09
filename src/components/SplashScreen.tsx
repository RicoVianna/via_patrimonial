// ===== SPLASH SCREEN - VIA PATRIMONIAL =====
import { useEffect, useState } from 'react'

interface SplashScreenProps {
    onConcluido: () => void
}

export default function SplashScreen({ onConcluido }: SplashScreenProps) {
    const [progresso, setProgresso] = useState(0)
    const [saindo, setSaindo] = useState(false)

    useEffect(() => {
        // Simula carregamento progressivo
        const intervalos = [
            { delay: 100,  valor: 15 },
            { delay: 400,  valor: 35 },
            { delay: 800,  valor: 60 },
            { delay: 1200, valor: 80 },
            { delay: 1600, valor: 95 },
            { delay: 2000, valor: 100 },
        ]

        const timers = intervalos.map(({ delay, valor }) =>
            setTimeout(() => setProgresso(valor), delay)
        )

        // Inicia fade out após completar
        const timerSaida = setTimeout(() => {
            setSaindo(true)
        }, 2400)

        // Chama onConcluido após fade out
        const timerFim = setTimeout(() => {
            onConcluido()
        }, 2900)

        return () => {
            timers.forEach(clearTimeout)
            clearTimeout(timerSaida)
            clearTimeout(timerFim)
        }
    }, [onConcluido])

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #0a1628 0%, #0f2444 50%, #0a1628 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            opacity: saindo ? 0 : 1,
            transition: 'opacity 0.5s ease',
            padding: '24px',
        }}>
            {/* Fundo com gradiente sutil */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(30, 58, 95, 0.4) 0%, transparent 50%)
                `,
                pointerEvents: 'none',
            }} />

            {/* Conteudo central */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '40px',
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '320px',
            }}>
                {/* Logo pulsante */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    animation: 'pulso 2s ease-in-out infinite',
                }}>
                    {/* Circulo com inicial */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(30,58,95,0.4) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'rgba(34, 197, 94, 0.9)',
                        }}>
                            V
                        </span>
                    </div>

                    {/* Nome com shimmer */}
                    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            color: 'white',
                            margin: 0,
                            lineHeight: 1.2,
                            position: 'relative',
                        }}>
                            Via
                        </h1>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'rgba(34, 197, 94, 0.8)',
                            margin: 0,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}>
                            Patrimonial
                        </h2>
                    </div>
                </div>

                {/* Barra de progresso */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Trilha da barra */}
                    <div style={{
                        width: '100%',
                        height: '2px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        {/* Preenchimento */}
                        <div style={{
                            height: '100%',
                            width: `${progresso}%`,
                            background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                            borderRadius: '2px',
                            transition: 'width 0.4s ease',
                            boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                            position: 'relative',
                        }}>
                            {/* Brilho na ponta */}
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '-2px',
                                width: '4px',
                                height: '6px',
                                background: 'rgba(34, 197, 94, 0.9)',
                                borderRadius: '50%',
                                boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                            }} />
                        </div>
                    </div>

                    {/* Texto de status */}
                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '0.75rem',
                        margin: 0,
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-body)',
                    }}>
                        {progresso < 40 && 'Inicializando...'}
                        {progresso >= 40 && progresso < 80 && 'Carregando dados...'}
                        {progresso >= 80 && progresso < 100 && 'Quase pronto...'}
                        {progresso === 100 && 'Bem-vindo!'}
                    </p>
                </div>
            </div>

            {/* Animacao CSS */}
            <style>{`
                @keyframes pulso {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(0.98); }
                }
            `}</style>
        </div>
    )
}