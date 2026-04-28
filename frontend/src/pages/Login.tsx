import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import api from '../lib/axios';
import { LogIn, Eye, EyeOff, Mail, Lock, Leaf, User, KeyRound } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/token/', { username, password });
      login(username, { access: data.access, refresh: data.refresh });

      const userRes = await api.get('/me/', {
        headers: { Authorization: `Bearer ${data.access}` }
      });
      useAuthStore.getState().setUser(userRes.data);
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Identifiants incorrects. Vérifiez votre nom d\'utilisateur et mot de passe.');
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-page-figma">
      {/* Top Navigation Bar */}
      <header className="login-header">
        <div className="login-header-inner">
          <div className="login-brand">
            <Leaf size={22} className="login-brand-icon" />
            <span className="login-brand-text">AgroSmart</span>
          </div>
          <nav className="login-nav">
            <a href="#" className="login-nav-active">Connexion</a>
            <a href="#" className="login-nav-link">À propos</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-card-figma">
          {/* Logo Section */}
          <div className="login-logo-section">
            <div className="login-logo-icon-box">
              <Leaf size={28} className="login-logo-leaf" />
            </div>
            <h1 className="login-title">AgroSmart</h1>
            <p className="login-subtitle">
              Connectez-vous pour accéder à votre tableau de bord B2B
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username */}
            <div className="login-field">
              <label className="login-label">NOM D'UTILISATEUR</label>
              <div className="login-input-wrap">
                <Mail size={20} className="login-input-icon" />
                <input
                  type="text"
                  className="login-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="commercial"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">MOT DE PASSE</label>
                <a href="#" className="login-forgot">Oublié ?</a>
              </div>
              <div className="login-input-wrap">
                <Lock size={20} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <span>Connexion</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="login-demo-section">
            <p className="login-demo-title">Comptes de démonstration :</p>
            <div className="login-demo-grid">
              <button
                type="button"
                className="login-demo-btn"
                onClick={() => fillDemo('commercial', 'commercial123')}
              >
                <div className="login-demo-icon-box">
                  <User size={18} />
                </div>
                <span className="login-demo-text">commercial / commercial123</span>
              </button>
              <button
                type="button"
                className="login-demo-btn"
                onClick={() => fillDemo('admin', 'admin123')}
              >
                <div className="login-demo-icon-box">
                  <KeyRound size={18} />
                </div>
                <span className="login-demo-text">admin / admin123</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-footer-inner">
          <div className="login-footer-brand">
            <span className="login-footer-name">AgroSmart</span>
            <span className="login-footer-copy">© 2024 AgroSmart. Tous droits réservés.</span>
          </div>
          <div className="login-footer-links">
            <a href="#">Confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
