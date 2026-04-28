import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useApi';
import { formatMAD, formatDate } from '../lib/utils';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(Number(id));

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!order) return <div className="empty-state"><p>Commande introuvable</p></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/orders" className="btn btn-ghost btn-sm"><ArrowLeft size={16} /></Link>
        <div>
          <h1>Commande {order.reference}</h1>
          <p>{order.client_name} — {order.client_region}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Articles commandés</h3>
          <table>
            <thead>
              <tr><th>Produit</th><th>Composition</th><th>Quantité</th><th>Prix unit.</th><th>Sous-total</th></tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.product_composition}</td>
                  <td>{item.quantity}</td>
                  <td>{formatMAD(item.unit_price)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatMAD(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Résumé</h3>
            <div className="order-summary">
              <div className="summary-row"><span>Statut</span><span className="badge green">{order.status_display}</span></div>
              <div className="summary-row"><span>Créée le</span><span>{formatDate(order.created_at)}</span></div>
              {order.delivery_date && <div className="summary-row"><span>Livraison</span><span>{formatDate(order.delivery_date)}</span></div>}
              <div className="summary-row"><span>Créée par</span><span>{order.created_by_name}</span></div>
              <div className="summary-row total"><span>Total</span><span>{formatMAD(order.total_amount)}</span></div>
            </div>
          </div>
          {order.notes && (
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Notes</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
