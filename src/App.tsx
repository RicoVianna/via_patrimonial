// ===== APP - VIA PATRIMONIAL =====
import { useState } from 'react'
import { useContexto } from './contexto'
import Sidebar from './components/Sidebar'
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
    const { dados } = useContexto()

    function renderizarTela() {
        switch (telaAtiva) {
            case 'dashboard':
                return <Dashboard />
            case 'imoveis':
                return <Imoveis />
            case 'receitas':
                return <Receitas />
            case 'despesas':
                return <Despesas />
            case 'historico':
                return <Historico />
            default:
                return <Dashboard />
        }
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)'
        }}>
            <Sidebar telaAtiva={telaAtiva} onNavegar={setTelaAtiva} />
            <main style={{
                flex: 1,
                padding: '32px',
                overflowY: 'auto',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {renderizarTela()}
            </main>
        </div>
    )
}

export default App