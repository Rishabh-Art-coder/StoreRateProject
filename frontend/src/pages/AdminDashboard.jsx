import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import AddForm from "../components/AddForm.jsx";
import AddUserForm from "../components/AddUserForm.jsx";
import DataTable from "../components/DataTable.jsx";
import Stars from "../components/Stars.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("stores");
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailError, setUserDetailError] = useState("");
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [userDetailReload, setUserDetailReload] = useState(0);

  useEffect(() => {
    api("/admin/stats")
      .then((data) => { setStats(data); setError(""); })
      .catch((requestError) => setError(requestError.message));
  }, [refresh]);

  useEffect(() => {
    if (!selectedUserId) {
      return undefined;
    }
    let active = true;
    api(`/admin/users/${selectedUserId}`)
      .then((data) => {
        if (active) setSelectedUser(data);
      })
      .catch((requestError) => {
        if (active) setUserDetailError(requestError.message);
      })
      .finally(() => {
        if (active) setUserDetailLoading(false);
      });
    return () => { active = false; };
  }, [selectedUserId, userDetailReload]);

  const viewUserDetails = (id) => {
    if (selectedUserId === id) {
      setSelectedUser(null);
      setUserDetailLoading(true);
      setUserDetailError("");
      setUserDetailReload((value) => value + 1);
      return;
    }
    setSelectedUserId(id);
    setSelectedUser(null);
    setUserDetailLoading(true);
    setUserDetailError("");
  };

  const closeUserDetails = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
    setUserDetailLoading(false);
    setUserDetailError("");
  };

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
        {[["stores", "Stores"], ["users", "Users"], ["addStore", "Add store"], ["addUser", "Add user"]].map(([key, label]) => (
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
      {tab === "users" && (
        <div className="card">
          <h2>All users</h2>
          <DataTable url="/admin/users" reload={refresh}
            filters={[
              { k: "name", label: "Filter by name" },
              { k: "email", label: "Filter by email" },
              { k: "address", label: "Filter by address" },
              { k: "role", label: "Any role", options: ["admin", "user", "owner"] },
            ]}
            cols={[
              {
                k: "name",
                label: "Name (select for details)",
                render: (row) => (
                  <button className="link" type="button" onClick={() => viewUserDetails(row.id)}>
                    {row.name}
                  </button>
                ),
              },
              { k: "email", label: "Email" },
              { k: "address", label: "Address" },
              { k: "role", label: "Role", render: (row) => <span className={`badge badge-${row.role}`}>{row.role}</span> },
              { k: "rating", label: "Owner rating", render: (row) => row.role === "owner" ? <Stars v={row.rating} /> : "—" },
            ]} />
          {userDetailLoading && <div className="empty">Loading user details…</div>}
          {userDetailError && <div className="err" role="alert">{userDetailError}</div>}
          {selectedUser && !userDetailLoading && (
            <div className="detail">
              <h2>{selectedUser.name}</h2>
              <div>Email: {selectedUser.email}</div>
              <div>Address: {selectedUser.address}</div>
              <div>Role: {selectedUser.role}</div>
              {selectedUser.role === "owner" && (
                <div>Store rating: <Stars v={selectedUser.rating} /></div>
              )}
              <button className="link" type="button" onClick={closeUserDetails}>Close details</button>
            </div>
          )}
        </div>
      )}
      {tab === "addStore" && <AddForm onDone={() => setRefresh((value) => value + 1)} />}
      {tab === "addUser" && (
        <AddUserForm onDone={() => {
          setRefresh((value) => value + 1);
          setTab("users");
        }} />
      )}
    </>
  );
}
