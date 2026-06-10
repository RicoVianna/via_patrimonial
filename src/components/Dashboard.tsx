// ===== DASHBOARD - VIA PATRIMONIAL =====
import { Building2, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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

    // ===== RECEITAS =====
    const receitaPrevista = receitasMes
        .reduce((acc, r) => acc + r.valor, 0)
    const receitaRecebida = receitasMes
        .filter(r => r.status === 'Recebido')
        .reduce((acc, r) => acc + r.valor, 0)
    const receitaPendente = receitasMes
        .filter(r => r.status === 'Pendente')
        .reduce((acc, r) => acc + r.valor, 0)
    const receitaAtrasada = receitasMes
        .filter(r => r.status === 'Atrasado')
        .reduce((acc, r) => acc + r.valor, 0)

    // ===== DESPESAS =====
    const despesaPrevista = despesasMes
        .reduce((acc, d) => acc + d.valor, 0)
    const despesaPaga = despesasMes
        .filter(d => d.status === 'Pago')
        .reduce((acc, d) => acc + d.valor, 0)
    const despesaPendente = despesasMes
        .filter(d => d.status === 'Pendente')
        .reduce((acc, d) => acc + d.valor, 0)
    const despesaAtrasada = despesasMes
        .filter(d => d.status === 'Atrasado')
        .reduce((acc, d) => acc + d.valor, 0)

    const saldoMensal = receitaRecebida - despesaPaga
    const nomeMes = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    // Grafico geral
    const dadosGraficoGeral = [
        { name: 'Recebido', value: receitaRecebida, cor: '#2e7d52' },
        { name: 'Previsto', value: receitaPendente + receitaAtrasada, cor: '#b45309' },
        { name: 'Despesas Pagas', value: despesaPaga, cor: '#c0392b' },
    ].filter(d => d.value > 0)

    // Grafico partilha
    const participantes = (dados.participantes || []).filter(p => p.ativo)
    const liquido = receitaRecebida - despesaPaga
    const dadosPartilha = participantes.map((p, i) => ({
        name: p.nome,
        value: Math.round(liquido * p.percentual / 100 * 100) / 100,
        cor: ['#1e3a5f', '#2e7d52', '#b8952a', '#c0392b', '#6c3483', '#1a5276'][i % 6]
    })).filter(d => d.value > 0)

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

    const temDados = dadosGraficoGeral.length > 0
    const temPartilha = dadosPartilha.length > 0

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

            {/* Grafico geral */}
            {temDados && (
                <>
                    <h2 style={estiloSecao}>Visao Geral do Mes</h2>
                    <div className="card" style={{ marginBottom: '8px' }}>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={dadosGraficoGeral}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {dadosGraficoGeral.map((entry, index) => (
                                        <Cell key={index} fill={entry.cor} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatarMoeda(value)}
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {/* Receitas */}
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
                    titulo="A Receber"
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

            {/* Despesas */}
            <h2 style={estiloSecao}>Despesas</h2>
            <div style={estiloGrid}>
                <CartaoMetrica
                    titulo="Despesa Prevista"
                    valor={formatarMoeda(despesaPrevista)}
                    icone={<TrendingDown size={22} />}
                    corFundo="var(--color-pending-bg)"
                    corIcone="var(--color-primary)"
                />
                <CartaoMetrica
                    titulo="Despesa Paga"
                    valor={formatarMoeda(despesaPaga)}
                    icone={<CheckCircle size={22} />}
                    corFundo="var(--color-success-bg)"
                    corIcone="var(--color-success)"
                    corValor="var(--color-success)"
                />
                <CartaoMetrica
                    titulo="A Pagar"
                    valor={formatarMoeda(despesaPendente)}
                    icone={<Clock size={22} />}
                    corFundo="var(--color-warning-bg)"
                    corIcone="var(--color-warning)"
                    corValor="var(--color-warning)"
                />
                <CartaoMetrica
                    titulo="Despesa Atrasada"
                    valor={formatarMoeda(despesaAtrasada)}
                    icone={<AlertCircle size={22} />}
                    corFundo="var(--color-danger-bg)"
                    corIcone="var(--color-danger)"
                    corValor="var(--color-danger)"
                />
            </div>

            {/* Saldo */}
            <h2 style={estiloSecao}>Saldo</h2>
            <CartaoMetrica
                titulo="Saldo Mensal (Recebido - Pago)"
                valor={formatarMoeda(saldoMensal)}
                icone={<Wallet size={22} />}
                corFundo={saldoMensal >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'}
                corIcone={saldoMensal >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
                corValor={saldoMensal >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
            />

            {/* Partilha */}
            {temPartilha && liquido > 0 && (
                <>
                    <h2 style={estiloSecao}>Partilha do Mes</h2>
                    <div className="card">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={dadosPartilha}
                                    cx="50%"
                                    cy="55%"
                                    outerRadius={110}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(1)}%`
                                    }
                                    labelLine={false}
                                >
                                    {dadosPartilha.map((entry, index) => (
                                        <Cell key={index} fill={entry.cor} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatarMoeda(value)}
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    )
}