// ===== SIDEBAR - VIA PATRIMONIAL =====
import { Home, Building2, TrendingUp, TrendingDown, History, PieChart, Settings } from 'lucide-react'
import { Tela } from '../App'

interface SidebarProps {
    telaAtiva: Tela
    onNavegar: (tela: Tela) => void
}

const itensMenu = [
    { id: 'dashboard' as Tela, label: 'Dashboard',  icone: Home },
    { id: 'imoveis'   as Tela, label: 'Imoveis',    icone: Building2 },
    { id: 'receitas'  as Tela, label: 'Receitas',   icone: TrendingUp },
    { id: 'despesas'  as Tela, label: 'Despesas',   icone: TrendingDown },
    { id: 'rateio'    as Tela, label: 'Rateio',     icone: PieChart },
    { id: 'historico' as Tela, label: 'Historico',  icone: History },
]

export default function Sidebar({ telaAtiva, onNavegar }: SidebarProps) {
    return (
        <aside style={{
            width: '240px',
            minHeight: '100vh',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{
                padding: '32px 24px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    lineHeight: 1.2
                }}>
                    Via
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-gold-light)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                }}>
                    Patrimonial
                </div>
            </div>

            {/* Menu */}
            <nav style={{ padding: '16px 12px', flex: 1 }}>
                {itensMenu.map(item => {
                    const Icone = item.icone
                    const ativo = telaAtiva === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavegar(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '11px 14px',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '4px',
                                backgroundColor: ativo ? 'rgba(255,255,255,0.12)' : 'transparent',
                                color: ativo ? 'white' : 'rgba(255,255,255,0.55)',
                                fontSize: '0.9rem',
                                fontWeight: ativo ? 600 : 400,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                border: 'none',
                                textAlign: 'left',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            <Icone size={18} />
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* Botao Admin */}
            <div style={{
                padding: '12px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
                <button
                    onClick={() => onNavegar('admin')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: telaAtiva === 'admin' ? 'rgba(255,255,255,0.12)' : 'transparent',
                        color: telaAtiva === 'admin' ? 'white' : 'rgba(255,255,255,0.55)',
                        fontSize: '0.9rem',
                        fontWeight: telaAtiva === 'admin' ? 600 : 400,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        border: 'none',
                        textAlign: 'left',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    <Settings size={18} />
                    Administrativo
                </button>
            </div>

            {/* Rodape */}
            <div style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.75rem',
            }}>
                Via Patrimonial &copy; {new Date().getFullYear()}
            </div>
        </aside>
    )
}