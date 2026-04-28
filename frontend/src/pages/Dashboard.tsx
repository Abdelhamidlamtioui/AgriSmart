import { useKPIs, useSalesTrends } from '../hooks/useApi';
import { formatMAD, formatDate, getStatusColor } from '../lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

const COLORS = ['#036b55', '#1d6a51', '#00897b', '#4db6ac', '#26a69a', '#66bb6a', '#81c784', '#a5d6a7'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#ffffff', border: '1px solid #bec9c3', borderRadius: 8, padding: '10px 14px', boxShadow: '0 8px 24px -8px rgba(30,107,82,0.06)' }}>
      <p style={{ fontSize: 12, color: '#6f7a74', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatMAD(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: kpis, isLoading: kLoading } = useKPIs();
  const { data: trends, isLoading: tLoading } = useSalesTrends();

  if (kLoading || tLoading) return <div className="loading-center"><div className="spinner" /></div>;

  const kpiCards = kpis ? [
    { label: kpis.revenue.label, value: formatMAD(kpis.revenue.value), change: kpis.revenue.change, icon: DollarSign, iconClass: 'green' },
    { label: kpis.orders.label, value: kpis.orders.value, change: kpis.orders.change, icon: ShoppingCart, iconClass: 'blue' },
    { label: kpis.products.label, value: kpis.products.value, sub: `${kpis.products.low_stock} en stock faible`, icon: Package, iconClass: 'amber' },
    { label: kpis.clients.label, value: kpis.clients.value, icon: Users, iconClass: 'green' },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <h1>Tableau de Bord</h1>
        <p>Vue d'ensemble de votre activité commerciale</p>
      </div>

      <div className="kpi-grid">
        {kpiCards.map((kpi, i) => (
          <div className="kpi-card" key={i}>
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon ${kpi.iconClass}`}><kpi.icon size={20} /></div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            {kpi.change !== undefined && (
              <div className={`kpi-change ${kpi.change >= 0 ? 'positive' : 'negative'}`}>
                {kpi.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.change >= 0 ? '+' : ''}{kpi.change}% vs mois dernier
              </div>
            )}
            {kpi.sub && <div style={{ fontSize: 12, color: 'var(--warning)', marginTop: 4 }}>{kpi.sub}</div>}
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>📈 Tendances des ventes (12 mois)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trends?.monthly || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#036b55" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#036b55" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#bec9c3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6f7a74' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6f7a74' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#036b55" strokeWidth={2.5} fill="url(#colorRev)" name="Revenus (MAD)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Ventes par région</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={trends?.by_region || []} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name?.slice(0, 8)} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {trends?.by_region?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Ventes par catégorie</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trends?.by_category || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#bec9c3" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6f7a74' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6f7a74' }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Revenus (MAD)">
                {trends?.by_category?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Top Produits</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {trends?.top_products?.slice(0, 6).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{p.quantity} unités</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{formatMAD(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {kpis?.recent_orders && (
        <div className="data-table-wrapper" style={{ marginTop: 16 }}>
          <div className="table-header"><h3>📋 Dernières commandes</h3></div>
          <table>
            <thead>
              <tr>
                <th>Référence</th><th>Client</th><th>Région</th><th>Montant</th><th>Statut</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {kpis.recent_orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{o.reference}</td>
                  <td>{o.client_name}</td>
                  <td>{o.client_region}</td>
                  <td style={{ fontWeight: 600 }}>{formatMAD(o.total_amount)}</td>
                  <td><span className="badge green">{o.status_display}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
