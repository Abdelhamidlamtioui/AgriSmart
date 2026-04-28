import { useState } from 'react';
import { formatMAD, formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Plus, Eye, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'expediee', label: 'Expédiée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
];

const statusBadge = (status: string, display: string) => {
  const map: Record<string, string> = {
    brouillon: 'gray', confirmee: 'blue', en_preparation: 'amber',
    expediee: 'amber', livree: 'green', annulee: 'red',
  };
  return <span className={`badge ${map[status] || 'gray'}`}>{display}</span>;
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('page_size', String(PAGE_SIZE));
      params.set('ordering', '-created_at');
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      return (await api.get(`/orders/?${params.toString()}`)).data;
    },
  });

  const orders = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Commandes</h1>
          <p>{totalCount} commande{totalCount !== 1 ? 's' : ''} au total</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary"><Plus size={18} /> Nouvelle Commande</Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Rechercher par référence, client..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ paddingLeft: 38, margin: 0 }}
          />
        </form>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <Filter size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{ paddingLeft: 36, margin: 0, minWidth: 180, cursor: 'pointer', appearance: 'auto' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {(search || statusFilter) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setSearch(''); setSearchInput(''); setStatusFilter(''); setPage(1); }}
            style={{ fontSize: 13 }}
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 15 }}>Aucune commande trouvée</p>
            {(search || statusFilter) && <p style={{ fontSize: 13 }}>Essayez de modifier vos filtres</p>}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Référence</th><th>Client</th><th>Région</th>
                <th>Articles</th><th>Montant</th><th>Statut</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{o.reference}</td>
                  <td>{o.client_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.client_region}</td>
                  <td>{o.item_count} articles</td>
                  <td style={{ fontWeight: 700 }}>{formatMAD(o.total_amount)}</td>
                  <td>{statusBadge(o.status, o.status_display)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(o.created_at)}</td>
                  <td>
                    <Link to={`/orders/${o.id}`} className="btn btn-ghost btn-sm"><Eye size={14} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, padding: '12px 0',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Affichage {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} sur {totalCount}
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              style={{ padding: '6px 10px' }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} style={{ padding: '4px 6px', color: 'var(--text-muted)' }}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPage(p as number)}
                    style={{ minWidth: 36, justifyContent: 'center', padding: '6px 8px' }}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="btn btn-ghost btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{ padding: '6px 10px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
