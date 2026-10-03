import { useEffect, useState } from "react";
import DataTable from "../components/Datatable";
import Stars from "../components/Stars.jsx";
// Store owner: apne store ki average rating aur rating dene walon ki list.
export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  // setData = {
  //   store : "card",
  //   average : "1",
  // }

  if (!data) return null;
  if (!data.store) return (
    <div className="card">
      <h2>No store linked yet</h2>
      <p className="empty">Ask an administrator to assign a store to your account.</p>
    </div>
  );

  return (
    <>
      <div className="stats">
        {/* <div className="stat"><b>{data.store.average ?? '–'}</b><span>Average rating for {data.store.name}</span></div> */}
        {/* <div className="stat"><b>{data.store.total}</b><span>Ratings received</span></div> */}
      </div>
      <div className="card">
        <h2>Customers who rated your store</h2>
        <DataTable url="/owner/dashboard"
          cols={[{ k: 'name', label: 'Name' }, { k: 'email', label: 'Email' },
            { k: 'rating', label: 'Rating', render: r => <Stars v={r.rating} /> }]} />
      </div>
    </>
  );
}
