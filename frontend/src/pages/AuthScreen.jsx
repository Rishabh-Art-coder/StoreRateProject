import { useState } from 'react';
import Field from '../components/Field.jsx';

export default function AuthScreen() {

  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [form, setForm] = useState({});
  const set = key => value => setForm({ ...form, [key]: value });


  

  return (
    <>
      <div className="card auth ">
        <h2>{mode == 'login' ? 'login in to StoreRate ' : 'Create your account'}</h2>
        {/* Sign Name  */}
        {mode == 'signup' && <Field label="Full name (20-60) characters" value={form.name || ''} onChange={set('name')} />}
        {/* Email both side */}
        <Field label="Email" type='email' value={form.email || ''} onChange={set('email')} />
        {/* signupAddress */}
        {mode == 'signup' && <Field label="Address" type='address' value={form.address || ''} onChange={set('address')} />}
        <Field label="Password" type='password' value={form.password || ''} onChange={set('password')} />
        {/* password error  */}
        {error && <div className='err'> {error}</div>}
        <button className='btn' onClick={submit}>{mode === 'login' ? 'Log in ' : 'Sign Up'}</button>


        <p>
          {mode === 'login' ? 'New here ?' : "Already registered?"}
          <button className='link' onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>

            {mode === 'login' ? 'create an Account' : 'Log in'}
          </button>
        </p>
      </div>
    </>
  );
}
