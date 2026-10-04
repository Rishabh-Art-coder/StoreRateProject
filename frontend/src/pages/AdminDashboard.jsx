import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import AddForm from "../components/AddForm.jsx";
import DataTable from "../components/DataTable.jsx";
import Stars from "../components/Stars.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("stores");
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/stats")
      .then((data) => { setStats(data); setError(""); })
      .catch((requestError) => setError(requestError.message));
  }, [refresh]);

  return (
    <>
      {stats && (
        <div className="stats">
          {[["Total users", stats.users], ["Total stores", stats.stores], ["Ratings submitted", stats.ratings]].map(([label, value]) => (
            <div className="stat" key={label}><b>{value}</b><span>{label}</span></div>
          ))}
        </div>
      )}
      {error && <div className="err" role="alert">{error}</div>}
      <div className="tabs">
        {[["stores", "Stores"], ["addStore", "Add store"]].map(([key, label]) => (
          <button key={key} className={`tab${tab === key ? " on" : ""}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      {tab === "stores" && (
        <div className="card">
          <h2>All stores</h2>
          <DataTable url="/admin/stores" reload={refresh}
            filters={[{ k: "name", label: "Filter by name" }, { k: "email", label: "Filter by email" }, { k: "address", label: "Filter by address" }]}
            cols={[
              { k: "name", label: "Name" },
              { k: "email", label: "Email" },
              { k: "address", label: "Address" },
              { k: "owner", label: "Owner" },
              { k: "rating", label: "Rating", render: (row) => <Stars v={row.rating} /> },
            ]} />
        </div>
      )}
      {tab === "addStore" && <AddForm onDone={() => setRefresh((value) => value + 1)} />}
    </>
  );
}
