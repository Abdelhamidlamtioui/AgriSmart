import { useState, useMemo } from 'react';
import { useProducts, useCategories } from '../hooks/useApi';
import { formatMAD, getSeasonLabel } from '../lib/utils';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  getPaginationRowModel, flexRender, createColumnHelper, type SortingState,
} from '@tanstack/react-table';
import type { Product } from '../types';
import { ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const col = createColumnHelper<Product>();

export default function Products() {
  const { data, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');

  const products = useMemo(() => {
    let list = data?.results || [];
    if (catFilter !== 'all') list = list.filter(p => p.category_name === catFilter);
    return list;
  }, [data, catFilter]);

  const columns = useMemo(() => [
    col.accessor('name', {
      header: 'Produit',
      cell: (info) => (
        <div>
          <div style={{ fontWeight: 600 }}>{info.getValue()}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{info.row.original.composition}</div>
        </div>
      ),
    }),
    col.accessor('category_name', { header: 'Catégorie', cell: (info) => <span className="badge green">{info.getValue()}</span> }),
    col.accessor('unit_price', {
      header: 'Prix unitaire',
      cell: (info) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatMAD(info.getValue())}</span>,
    }),
    col.accessor('unit', { header: 'Unité' }),
    col.accessor('stock_quantity', {
      header: 'Stock',
      cell: (info) => {
        const low = info.row.original.is_low_stock;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, color: low ? 'var(--danger)' : 'var(--text-primary)' }}>{info.getValue()}</span>
            {low && <AlertTriangle size={14} color="var(--warning)" />}
          </div>
        );
      },
    }),
    col.accessor('season_recommendation', {
      header: 'Saison',
      cell: (info) => <span style={{ fontSize: 12 }}>{getSeasonLabel(info.getValue())}</span>,
    }),
  ], []);

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Catalogue Produits</h1>
        <p>{data?.results?.length || 0} produits fertilisants disponibles</p>
      </div>

      <div className="filter-bar">
        <input className="table-search" placeholder="🔍 Rechercher un produit..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        <div className={`filter-chip ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>Tous</div>
        {categories?.map((c) => (
          <div key={c.id} className={`filter-chip ${catFilter === c.name ? 'active' : ''}`} onClick={() => setCatFilter(c.name)}>
            {c.name} ({c.product_count})
          </div>
        ))}
      </div>

      <div className="data-table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      <ArrowUpDown size={12} style={{ opacity: 0.4 }} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={14} /> Précédent
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
