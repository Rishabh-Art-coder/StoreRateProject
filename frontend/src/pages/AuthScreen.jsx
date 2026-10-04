import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { firstError } from '../utils/validation';
import Field from '../components/Field';

// Login aur Signup dono ek hi screen par; "mode" se pata chalta hai kaun sa dikhana hai.
export default function AuthScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const set = key => value => setForm({ ...form, [key]: value });

  const submit = async () => {
    // Signup mein pehle browser mein hi validation check hoti hai.
    const problem = mode === 'signup' ? firstError(form, ['name', 'email', 'address', 'password']) : null;
    if (problem) return setError(problem);
    try {
      const data = await api('/auth/' + mode, { method: 'POST', body: form });
      login(data.token, data.user);
    } catch (x) { setError(x.message); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div className="brand"><div className="logo">S</div><h1>StoreRate</h1></div>
        <h2>Honest ratings for every store you love.</h2>
        <p>Discover stores, share your experience and help others choose better. Store owners get a clear view of how customers rate them.</p>
        <ul>
          <li><span>★</span>Rate any store from 1 to 5</li>
          <li><span>★</span>Update your rating anytime</li>
          <li><span>★</span>Owners track their average score</li>
        </ul>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="sub">{mode === 'login' ? 'Log in to continue to StoreRate.' : 'It takes less than a minute.'}</p>
          {mode === 'signup' && <Field label="Full name (20-60 characters)" value={form.name || ''} onChange={set('name')} />}
          <Field label="Email" type="email" value={form.email || ''} onChange={set('email')} />
          {mode === 'signup' && <Field label="Address" value={form.address || ''} onChange={set('address')} />}
          <Field label="Password" type="password" value={form.password || ''} onChange={set('password')} />
          {error && <div className="err">{error}</div>}
          <button className="btn" onClick={submit}>{mode === 'login' ? 'Log in' : 'Sign up'}</button>
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
