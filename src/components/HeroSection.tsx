// ===== HERO SECTION - VIA PATRIMONIAL =====
interface HeroSectionProps {
    onEntrar: () => void
}

export default function HeroSection({ onEntrar }: HeroSectionProps) {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#0a1628',
        }}>
            {/* Imagem de fundo */}
            <img
                src="/hero_section.png"
                alt="Via Patrimonial"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                }}
            />

            {/* Botao invisivel sobre o botao Entrar da imagem */}
            <button
                onClick={onEntrar}
                style={{
                    position: 'absolute',
                    bottom: '3.9%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.border = '2px solid rgba(34, 197, 94, 0.5)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'
                    e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.border = '2px solid transparent'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.background = 'transparent'
                }}
            />
        </div>
    )
}