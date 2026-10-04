import { useState } from "react";
import { api } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import RatingPicker from "../components/RatingPicker.jsx";
import Stars from "../components/Stars.jsx";

export default function UserDashboard() {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');

  const rate = async (storeId, rating) => {
    try {
      await api(`/stores/${storeId}/rating`, { method: 'POST', body: { rating } });
      setRefresh((value) => value + 1);
      setError('');
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <div className="card">
      <h2>Find and rate stores</h2>
      <input aria-label="Search stores" placeholder="Search by store name or address" value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
      {error && <div className="err" role="alert">{error}</div>}
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
