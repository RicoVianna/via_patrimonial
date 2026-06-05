import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProvedorContexto } from './contexto'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ProvedorContexto>
            <App />
        </ProvedorContexto>
    </StrictMode>,
)