import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, useProducts, useCreateOrder, useAISuggest } from '../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { formatMAD } from '../lib/utils';
import { Check, ChevronRight, ChevronLeft, Sparkles, ShoppingCart, User, Truck, CheckCircle } from 'lucide-react';

interface CartItem { product: number; name: string; composition: string; quantity: number; unit_price: number; }

const steps = [
  { label: 'Client', icon: User },
  { label: 'Produits', icon: ShoppingCart },
  { label: 'Livraison', icon: Truck },
  { label: 'Confirmation', icon: CheckCircle },
];

export default function NewOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [clientId, setClientId] = useState<number | ''>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);

  const { data: clientsData } = useClients();
  const { data: productsData } = useProducts();
  const createOrder = useCreateOrder();
  const aiSuggest = useAISuggest();

  const clients = clientsData?.results || [];
  const products = productsData?.results || [];
  const selectedClient = clients.find(c => c.id === clientId);
  const total = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const toggleProduct = (p: any) => {
    const exists = cart.find(c => c.product === p.id);
    if (exists) {
      setCart(cart.filter(c => c.product !== p.id));
    } else {
      setCart([...cart, { product: p.id, name: p.name, composition: p.composition, quantity: 1, unit_price: p.unit_price }]);
    }
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(cart.map(c => c.product === productId ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  const fetchSuggestions = () => {
    const names = cart.map(c => c.name);
    const region = selectedClient?.region_name;
    aiSuggest.mutate({ products: names, region }, {
      onSuccess: (data) => setSuggestions(data),
    });
  };

  const submitOrder = () => {
    if (!clientId) return;
    createOrder.mutate(
      {
        client: clientId as number,
        notes,
        delivery_date: deliveryDate,
        items: cart.map(c => ({ product: c.product, quantity: c.quantity, unit_price: c.unit_price })),
      },
      {
        onSuccess: (data) => {
          setOrderRef(data.reference);
          setStep(3);
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['kpis'] });
        },
      }
    );
  };

  const canNext = () => {
    if (step === 0) return !!clientId;
    if (step === 1) return cart.length > 0;
    if (step === 2) return !!deliveryDate;
    return false;
  };

  const handleNext = () => {
    if (step === 1 && cart.length > 0) fetchSuggestions();
    if (step === 2) { submitOrder(); return; }
    setStep(s => s + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Nouvelle Commande</h1>
        <p>Créez une commande de fertilisants en quelques étapes</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
              <div className="step-circle">{i < step ? <Check size={16} /> : i + 1}</div>
              <span className="step-label">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`step-line ${i < step ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Step 0: Client */}
        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Sélectionner le client</h3>
            <div className="form-group">
              <label className="form-label">Client</label>
              <select className="form-select" value={clientId} onChange={(e) => setClientId(Number(e.target.value) || '')}>
                <option value="">-- Choisir un client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name} — {c.company} ({c.region_name})</option>
                ))}
              </select>
            </div>
            {selectedClient && (
              <div style={{ background: 'var(--accent-dim)', borderRadius: 'var(--radius)', padding: 14, marginTop: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{selectedClient.full_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedClient.company} • {selectedClient.region_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedClient.phone} • {selectedClient.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Products */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Sélectionner les produits ({cart.length} sélectionnés)</h3>
            <div className="product-grid">
              {products.map(p => {
                const inCart = cart.find(c => c.product === p.id);
                return (
                  <div key={p.id} className={`product-select-card ${inCart ? 'selected' : ''}`} onClick={() => !inCart && toggleProduct(p)}>
                    <div className="product-name">{p.name}</div>
                    <div className="product-comp">{p.composition}</div>
                    <div className="product-price">{formatMAD(p.unit_price)}/{p.unit}</div>
                    {inCart && (
                      <div className="qty-control" onClick={(e) => e.stopPropagation()}>
                        <button className="qty-btn" onClick={() => updateQty(p.id, -1)}>−</button>
                        <span className="qty-value">{inCart.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(p.id, 1)}>+</button>
                        <button className="qty-btn" style={{ marginLeft: 'auto', color: 'var(--danger)' }} onClick={() => toggleProduct(p)}>✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {suggestions && (
              <div className="ai-suggestion-box">
                <h4><Sparkles size={16} /> Suggestions IA</h4>
                {suggestions.suggestions?.map((s: any, i: number) => (
                  <div className="ai-suggestion-item" key={i}>
                    <strong>{s.product_name}</strong> — {s.reason}
                  </div>
                ))}
                {suggestions.conseil_saison && (
                  <p style={{ marginTop: 10, fontSize: 13, color: 'var(--accent-amber)', fontStyle: 'italic' }}>
                    💡 {suggestions.conseil_saison}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Récapitulatif & Livraison</h3>
            <div className="order-summary" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Client: <strong style={{ color: 'var(--text-primary)' }}>{selectedClient?.full_name}</strong></p>
              {cart.map(c => (
                <div className="summary-row" key={c.product}>
                  <span>{c.name} × {c.quantity}</span>
                  <span>{formatMAD(c.quantity * c.unit_price)}</span>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatMAD(total)}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date de livraison souhaitée</label>
              <input type="date" className="form-input" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optionnel)</label>
              <textarea className="form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instructions spéciales..." />
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="confirmation-page" style={{ minHeight: 'auto', padding: '40px 0' }}>
            <div className="confirmation-card">
              <div className="success-icon"><CheckCircle size={40} /></div>
              <h2 style={{ marginBottom: 8 }}>Commande créée avec succès ! 🎉</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>Référence: <strong style={{ color: 'var(--accent)' }}>{orderRef}</strong></p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Montant total: <strong style={{ color: 'var(--accent)' }}>{formatMAD(total)}</strong></p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => { setStep(0); setCart([]); setClientId(''); setSuggestions(null); setOrderRef(''); }}>
                  Nouvelle commande
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>Dashboard</button>
                <button className="btn btn-secondary" onClick={() => navigate('/orders')}>Voir commandes</button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
              <ChevronLeft size={16} /> Précédent
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={!canNext() || createOrder.isPending}>
              {createOrder.isPending ? 'Envoi...' : step === 2 ? 'Confirmer la commande' : 'Suivant'} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
