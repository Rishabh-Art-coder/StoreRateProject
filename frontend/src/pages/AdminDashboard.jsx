import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import AddForm from '../components/AddForm';
import Stars from '../components/Stars';

const tabs = [['stores', 'Stores'], ['users', 'Users'], ['addStore', 'Add store'], ['addUser', 'Add user']];
const nameEmailAddress = [
  { k: 'name', label: 'Filter by name' }, { k: 'email', label: 'Filter by email' }, { k: 'address', label: 'Filter by address' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [tab, setTab] = useState('stores');
  const [refresh, setRefresh] = useState(0); // naya user/store judne par badhta hai
  const [detail, setDetail] = useState(null); // click kiye gaye user ki details

  useEffect(() => { api('/admin/stats').then(setStats); }, [refresh]);

  return (
    <>
      <div className="stats">
        {[['Total users', stats.users], ['Total stores', stats.stores], ['Ratings submitted', stats.ratings]].map(([label, value]) => (
          <div className="stat" key={label}><b>{value ?? '–'}</b><span>{label}</span></div>
        ))}
      </div>

      <div className="tabs">
        {tabs.map(([key, label]) => (
          <button key={key} className={'tab' + (tab === key ? ' on' : '')} onClick={() => { setTab(key); setDetail(null); }}>{label}</button>
        ))}
      </div>

      {tab === 'stores' && (
        <div className="card">
          <h2>All stores</h2>
          <DataTable url="/admin/stores" reload={refresh} filters={nameEmailAddress}
            cols={[{ k: 'name', label: 'Name' }, { k: 'email', label: 'Email' }, { k: 'address', label: 'Address' },
              { k: 'rating', label: 'Rating', render: r => <Stars v={r.rating} /> }]} />
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <h2>All users</h2>
          <p className="empty" style={{ padding: 0 }}>Click a row to see full details.</p>
          <DataTable url="/admin/users" reload={refresh}
            onRow={r => api('/admin/users/' + r.id).then(setDetail)}
            filters={[...nameEmailAddress, { k: 'role', label: 'Any role', options: ['admin', 'user', 'owner'] }]}
            cols={[{ k: 'name', label: 'Name' }, { k: 'email', label: 'Email' }, { k: 'address', label: 'Address' }, { k: 'role', label: 'Role', render: r => <span className={'badge badge-' + r.role}>{r.role}</span> }]} />
          {detail && (
            <div className="detail">
              <h2>{detail.name}</h2>
              {detail.email}<br />{detail.address}<br />Role: {detail.role}
              {detail.role === 'owner' && <div>Store rating: <Stars v={detail.rating} /></div>}
            </div>
          )}
        </div>
      )}

      {tab === 'addStore' && <AddForm kind="store" onDone={() => setRefresh(refresh + 1)} />}
      {tab === 'addUser' && <AddForm kind="user" onDone={() => setRefresh(refresh + 1)} />}
    </>
  );
}
