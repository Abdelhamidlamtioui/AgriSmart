import { useState } from 'react';
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Shield, User } from 'lucide-react';

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', first_name: '', last_name: '', email: '', is_staff: false });
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createUser.mutate(form, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setShowForm(false);
        setForm({ username: '', password: '', first_name: '', last_name: '', email: '', is_staff: false });
      },
      onError: (err: any) => setError(err.response?.data?.error || 'Erreur lors de la création'),
    });
  };

  const handleDelete = (id: number, username: string) => {
    if (!confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    deleteUser.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
      onError: (err: any) => alert(err.response?.data?.error || 'Erreur'),
    });
  };

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Gestion des Utilisateurs</h1>
          <p>{users?.length || 0} utilisateurs enregistrés</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={18} /> Nouvel Utilisateur
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 600 }}>
          <h3 style={{ marginBottom: 16 }}>Créer un utilisateur</h3>
          {error && <div style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="form-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nom d'utilisateur</label>
                <input className="form-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.is_staff} onChange={(e) => setForm({ ...form, is_staff: e.target.checked })} />
                  Accès administrateur (staff)
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={createUser.isPending}>
                {createUser.isPending ? 'Création...' : 'Créer l\'utilisateur'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th><th>Nom complet</th><th>Email</th><th>Rôle</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: u.is_superuser ? 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))' : 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {u.is_superuser ? <Shield size={14} color="white" /> : <User size={14} color="white" />}
                    </div>
                    {u.username}
                  </div>
                </td>
                <td>{u.first_name} {u.last_name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email || '—'}</td>
                <td>
                  {u.is_superuser
                    ? <span className="badge red">Super Admin</span>
                    : u.is_staff
                      ? <span className="badge amber">Administrateur</span>
                      : <span className="badge green">Commercial</span>
                  }
                </td>
                <td>
                  {!u.is_superuser && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(u.id, u.username)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
