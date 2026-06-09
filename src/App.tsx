// ===== APP - VIA PATRIMONIAL =====
import { useState, useEffect } from 'react'
import { useContexto } from './contexto'
import HeroSection from './components/HeroSection'
import Login from './components/Login'
import SplashScreen from './components/SplashScreen'
import Sidebar from './components/Sidebar'
import NavMobile from './components/NavMobile'
import Dashboard from './components/Dashboard'
import Imoveis from './components/Imoveis'
import Receitas from './components/Receitas'
import Despesas from './components/Despesas'
import Historico from './components/Historico'
import Rateio from './components/Rateio'
import Admin from './components/Admin'

export type Tela =
    | 'dashboard'
    | 'imoveis'
    | 'receitas'
    | 'despesas'
    | 'rateio'
    | 'historico'
    | 'admin'

type Etapa = 'hero' | 'login' | 'splash' | 'sistema'

function App() {
    const [etapa, setEtapa] = useState<Etapa>('hero')
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

    // ===== FLUXO DE ENTRADA =====
    if (etapa === 'hero') {
        return <HeroSection onEntrar={() => setEtapa('login')} />
    }

    if (etapa === 'login') {
        return <Login onLogin={() => setEtapa('splash')} />
    }

    if (etapa === 'splash') {
        return <SplashScreen onConcluido={() => setEtapa('sistema')} />
    }

    // ===== SISTEMA PRINCIPAL =====
    function renderizarTela() {
        switch (telaAtiva) {
            case 'dashboard': return <Dashboard />
            case 'imoveis': return <Imoveis />
            case 'receitas': return <Receitas />
            case 'despesas': return <Despesas />
            case 'rateio': return <Rateio />
            case 'historico': return <Historico />
            case 'admin': return <Admin />
            default: return <Dashboard />
        }
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)'
        }}>
            {!isMobile && (
                <Sidebar telaAtiva={telaAtiva} onNavegar={setTelaAtiva} />
            )}

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

            {isMobile && (
                <NavMobile telaAtiva={telaAtiva} onNavegar={setTelaAtiva} />
            )}
        </div>
    )
}

export default App