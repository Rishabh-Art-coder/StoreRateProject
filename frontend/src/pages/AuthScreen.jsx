import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';
import { firstError } from '../utils/validation.js';

export default function AuthScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = key => value => setForm(current => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'signup') {
      const validationError = firstError(form, ['name', 'email', 'address', 'password']);
      if (validationError) return setError(validationError);
    }
    if (mode === 'login' && (!(form.email || '').trim() || !(form.password || ''))) {
      return setError('Enter your email and password.');
    }
    setBusy(true);
    try {
      const data = await api('/auth/' + mode, { method: 'POST', body: form });
      if (!data?.user || !data?.token) throw new Error('The server returned an invalid authentication response.');
      login(data.user, data.token);
    } catch (x) {
      setError(x.message);
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div className="brand"><div className="logo">S</div><h1>StoreRate</h1></div>
        <h2>Honest ratings for every store you love.</h2>
        <p>Discover stores, share your experience and help others choose better. Store owners get a clear view of how customers rate them.</p>
        <ul>
          <li><span>★</span>Customers rate stores from 1 to 5</li>
          <li><span>★</span>Admins can add stores</li>
          <li><span>★</span>Owners can track their store and customer ratings</li>
        </ul>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="sub">{mode === 'login' ? 'Log in to continue to StoreRate.' : 'Create a customer account to rate stores.'}</p>
          <form onSubmit={submit}>
            {mode === 'signup' && <Field label="Full name" value={form.name || ''} onChange={set('name')} maxLength={60} required />}
            <Field label="Email" type="email" value={form.email || ''} onChange={set('email')} required />
            {mode === 'signup' && <Field label="Address" value={form.address || ''} onChange={set('address')} maxLength={400} required />}
            <Field label="Password" type="password" value={form.password || ''} onChange={set('password')} required />
            {error && <div className="err" role="alert">{error}</div>}
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
          </form>
          {mode === 'login' && <p className="sub">Use an account registered with this StoreRate server.</p>}
          <p className="switch">
            {mode === 'login' ? 'New here? ' : 'Already registered? '}
            <button className="link" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
