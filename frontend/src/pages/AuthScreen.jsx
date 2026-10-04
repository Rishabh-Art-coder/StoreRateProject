import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';

const demoAccounts = [
  { label: "Admin", email: "admin@storerate.com", password: "Admin@123" },
  { label: "Owner", email: "owner@storerate.com", password: "Owner@123" },
  { label: "User", email: "user@storerate.com", password: "User@123" },
];

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
      if ((form.name || '').trim().length < 2 || (form.name || '').trim().length > 60) return setError('Name must be between 2 and 60 characters.');
      if (!(form.address || '').trim()) return setError('Address is required.');
      if ((form.password || '').length < 8) return setError('Password must be at least 8 characters.');
    }
    if (!(form.email || '').trim() || !(form.password || '')) return setError('Enter your email and password.');
    setBusy(true);
    try {
      const data = await api('/auth/' + mode, { method: 'POST', body: form });
      login(data.user);
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
          <li><span>★</span>Owners can view all stores and users</li>
        </ul>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="sub">{mode === 'login' ? 'Log in to continue to StoreRate.' : 'Create a customer account to rate stores.'}</p>
          <form onSubmit={submit}>
            {mode === 'signup' && <Field label="Full name" value={form.name || ''} onChange={set('name')} />}
            <Field label="Email" type="email" value={form.email || ''} onChange={set('email')} />
            {mode === 'signup' && <Field label="Address" value={form.address || ''} onChange={set('address')} />}
            <Field label="Password" type="password" value={form.password || ''} onChange={set('password')} />
            {error && <div className="err" role="alert">{error}</div>}
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
          </form>
          {mode === 'login' && (
            <div className="demo-logins">
              <strong>Quick demo login</strong>
              {demoAccounts.map(account => (
                <button className="demo-login" key={account.email} onClick={() => { setForm({ email: account.email, password: account.password }); setError(''); }}>
                  {account.label}<span>{account.email}</span>
                </button>
              ))}
              <small>Demo passwords: Admin@123, Owner@123, User@123</small>
            </div>
          )}
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
