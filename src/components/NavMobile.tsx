// ===== NAVEGACAO MOBILE - VIA PATRIMONIAL =====
import { Home, Building2, TrendingUp, TrendingDown, History } from 'lucide-react'
import { Tela } from '../App'

interface NavMobileProps {
    telaAtiva: Tela
    onNavegar: (tela: Tela) => void
}

const itensMenu = [
    { id: 'dashboard' as Tela, label: 'Inicio',    icone: Home },
    { id: 'imoveis'   as Tela, label: 'Imoveis',   icone: Building2 },
    { id: 'receitas'  as Tela, label: 'Receitas',  icone: TrendingUp },
    { id: 'despesas'  as Tela, label: 'Despesas',  icone: TrendingDown },
    { id: 'historico' as Tela, label: 'Historico', icone: History },
]

export default function NavMobile({ telaAtiva, onNavegar }: NavMobileProps) {
    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px 0 12px',
            zIndex: 100,
            boxShadow: '0 -2px 12px rgba(30,58,95,0.15)'
        }}>
            {itensMenu.map(item => {
                const Icone = item.icone
                const ativo = telaAtiva === item.id
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavegar(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: ativo ? 'white' : 'rgba(255,255,255,0.5)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Icone size={20} />
                        <span style={{
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-body)',
                            fontWeight: ativo ? 600 : 400,
                        }}>
                            {item.label}
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}