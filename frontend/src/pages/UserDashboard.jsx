import { useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import RatingPicker from '../components/RatingPicker';
import Stars from '../components/Stars';

// Normal user: stores dhundho aur 1-5 rating do ya badlo.
export default function UserDashboard() {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');

  const rate = async (storeId, rating) => {
    try {
      await api(`/stores/${storeId}/rating`, { method: 'POST', body: { rating } });
      setRefresh(refresh + 1); // table dobara load hogi, nayi rating dikhegi
    } catch (x) { setError(x.message); }
  };

  return (
    <div className="card">
      <h2>Find and rate stores</h2>
      <input placeholder="Search by store name or address" value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
      {error && <div className="err">{error}</div>}
      <DataTable url="/stores" reload={refresh} extraParams={{ search }}
        cols={[
          { k: 'name', label: 'Store' },
          { k: 'address', label: 'Address' },
          { k: 'rating', label: 'Overall rating', render: r => <Stars v={r.rating} /> },
          {
            k: 'my_rating', label: 'Your rating (click to set or change)',
            render: r => <RatingPicker value={r.my_rating} onPick={v => rate(r.id, v)} />
          },
        ]} />
    </div>
  );
}
