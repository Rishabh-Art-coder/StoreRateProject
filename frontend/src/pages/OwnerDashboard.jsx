import { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Stars from "../components/Stars.jsx";

export default function OwnerDashboard() {
  const [tab, setTab] = useState("stores");
  const tabs = [["stores", "All stores"], ["users", "All users"]];
  return (
    <>
      <div className="tabs">
        {tabs.map(([key, label]) => (
          <button key={key} className={`tab${tab === key ? " on" : ""}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      {tab === "stores" && (
        <div className="card">
          <h2>All stores</h2>
          <DataTable url="/owner/stores"
            filters={[{ k: "name", label: "Filter by name" }, { k: "address", label: "Filter by address" }]}
            cols={[
              { k: "name", label: "Store" },
              { k: "email", label: "Email" },
              { k: "address", label: "Address" },
              { k: "owner", label: "Store owner" },
              { k: "rating", label: "Rating", render: (row) => <Stars v={row.rating} /> },
            ]} />
        </div>
      )}
      {tab === "users" && (
        <div className="card">
          <h2>All users</h2>
          <DataTable url="/owner/users"
            filters={[
              { k: "name", label: "Filter by name" },
              { k: "email", label: "Filter by email" },
              { k: "address", label: "Filter by address" },
              { k: "role", label: "Any role", options: ["admin", "user", "owner"] },
            ]}
            cols={[
              { k: "name", label: "Name" },
              { k: "email", label: "Email" },
              { k: "address", label: "Address" },
              { k: "role", label: "Role", render: (row) => <span className={`badge badge-${row.role}`}>{row.role}</span> },
            ]} />
        </div>
      )}
    </>
  );
}
