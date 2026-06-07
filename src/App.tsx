// ===== APP - VIA PATRIMONIAL =====
import { useState, useEffect } from 'react'
import { useContexto } from './contexto'
import Sidebar from './components/Sidebar'
import NavMobile from './components/NavMobile'
import Dashboard from './components/Dashboard'
import Imoveis from './components/Imoveis'
import Receitas from './components/Receitas'
import Despesas from './components/Despesas'
import Historico from './components/Historico'

export type Tela =
    | 'dashboard'
    | 'imoveis'
    | 'receitas'
    | 'despesas'
    | 'historico'

function App() {
    const [telaAtiva, setTelaAtiva] = useState<Tela>('dashboard')
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const { dados } = useContexto()

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    function renderizarTela() {
        switch (telaAtiva) {
            case 'dashboard': return <Dashboard />
            case 'imoveis': return <Imoveis />
            case 'receitas': return <Receitas />
            case 'despesas': return <Despesas />
            case 'historico': return <Historico />
            default: return <Dashboard />
        }
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)'
        }}>
            {/* Menu lateral - apenas desktop */}
            {!isMobile && (
                <Sidebar telaAtiva={telaAtiva} onNavegar={setTelaAtiva} />
            )}

            {/* Conteudo principal */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%',
            }}>
                <main style={{
                    flex: 1,
                    padding: isMobile ? '16px' : '32px',
                    maxWidth: isMobile ? '100%' : '1200px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingBottom: isMobile ? '90px' : '32px',
                }}>
                    {renderizarTela()}
                </main>
            </div>

            {/* Menu inferior - apenas mobile */}
            {isMobile && (
                <NavMobile telaAtiva={telaAtiva} onNavegar={setTelaAtiva} />
            )}
        </div>
    )
}

export default App