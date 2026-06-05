// ===== DASHBOARD - VIA PATRIMONIAL =====
import { Building2, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, Wallet } from 'lucide-react'
import { useContexto } from '../contexto'

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

interface CartaoMetricaProps {
    titulo: string
    valor: string
    icone: React.ReactNode
    corFundo: string
    corIcone: string
    corValor?: string
}

function CartaoMetrica({ titulo, valor, icone, corFundo, corIcone, corValor }: CartaoMetricaProps) {
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: corFundo,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: corIcone,
                flexShrink: 0,
            }}>
                {icone}
            </div>
            <div>
                <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>{titulo}</p>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: corValor || 'var(--color-text)',
                    fontFamily: 'var(--font-body)'
                }}>
                    {valor}
                </div>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { dados } = useContexto()

    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()

    const receitasMes = dados.receitas.filter(
        r => r.mes === mesAtual && r.ano === anoAtual
    )
    const despesasMes = dados.despesas.filter(
        d => d.mes === mesAtual && d.ano === anoAtual
    )

    const receitaPrevista = receitasMes.reduce((acc, r) => acc + r.valor, 0)
    const receitaRecebida = receitasMes
        .filter(r => r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const receitaPendente = receitasMes
        .filter(r => r.status === 'Pendente' || r.status === 'Atrasado')
        .reduce((acc, r) => acc + r.valor, 0)
    const receitaAtrasada = receitasMes
        .filter(r => r.status === 'Atrasado')
        .reduce((acc, r) => acc + r.valor, 0)

    const despesaTotal = despesasMes.reduce((acc, d) => acc + d.valor, 0)
    const despesaPaga = despesasMes
        .filter(d => d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const despesaAtrasada = despesasMes
        .filter(d => d.status === 'Atrasado')
        .reduce((acc, d) => acc + d.valor, 0)

    const saldoMensal = receitaRecebida - despesaPaga
    const nomeMes = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    const estiloSecao = {
        marginBottom: '12px',
        marginTop: '28px',
        fontSize: '1rem',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const
    }

    const estiloGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '8px'
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '6px' }}>Dashboard</h1>
                <p style={{ textTransform: 'capitalize' }}>{nomeMes}</p>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <CartaoMetrica
                    titulo="Total de Imoveis Cadastrados"
                    valor={String(dados.imoveis.filter(i => i.ativo).length)}
                    icone={<Building2 size={22} />}
                    corFundo="var(--color-pending-bg)"
                    corIcone="var(--color-primary)"
                />
            </div>

            <h2 style={estiloSecao}>Receitas</h2>
            <div style={estiloGrid}>
                <CartaoMetrica
                    titulo="Receita Prevista"
                    valor={formatarMoeda(receitaPrevista)}
                    icone={<TrendingUp size={22} />}
                    corFundo="var(--color-pending-bg)"
                    corIcone="var(--color-primary)"
                />
                <CartaoMetrica
                    titulo="Receita Recebida"
                    valor={formatarMoeda(receitaRecebida)}
                    icone={<CheckCircle size={22} />}
                    corFundo="var(--color-success-bg)"
                    corIcone="var(--color-success)"
                    corValor="var(--color-success)"
                />
                <CartaoMetrica
                    titulo="Receita Pendente"
                    valor={formatarMoeda(receitaPendente)}
                    icone={<Clock size={22} />}
                    corFundo="var(--color-warning-bg)"
                    corIcone="var(--color-warning)"
                    corValor="var(--color-warning)"
                />
                <CartaoMetrica
                    titulo="Receita Atrasada"
                    valor={formatarMoeda(receitaAtrasada)}
                    icone={<AlertCircle size={22} />}
                    corFundo="var(--color-danger-bg)"
                    corIcone="var(--color-danger)"
                    corValor="var(--color-danger)"
                />
            </div>

            <h2 style={estiloSecao}>Despesas</h2>
            <div style={estiloGrid}>
                <CartaoMetrica
                    titulo="Despesas do Mes"
                    valor={formatarMoeda(despesaTotal)}
                    icone={<TrendingDown size={22} />}
                    corFundo="var(--color-pending-bg)"
                    corIcone="var(--color-primary)"
                />
                <CartaoMetrica
                    titulo="Despesas Pagas"
                    valor={formatarMoeda(despesaPaga)}
                    icone={<CheckCircle size={22} />}
                    corFundo="var(--color-success-bg)"
                    corIcone="var(--color-success)"
                    corValor="var(--color-success)"
                />
                <CartaoMetrica
                    titulo="Despesas Atrasadas"
                    valor={formatarMoeda(despesaAtrasada)}
                    icone={<AlertCircle size={22} />}
                    corFundo="var(--color-danger-bg)"
                    corIcone="var(--color-danger)"
                    corValor="var(--color-danger)"
                />
            </div>

            <h2 style={estiloSecao}>Saldo</h2>
            <CartaoMetrica
                titulo="Saldo Mensal (Recebido - Pago)"
                valor={formatarMoeda(saldoMensal)}
                icone={<Wallet size={22} />}
                corFundo={saldoMensal >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'}
                corIcone={saldoMensal >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
                corValor={saldoMensal >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
            />
        </div>
    )
}