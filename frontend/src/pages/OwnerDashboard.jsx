import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Stars from "../components/Stars.jsx";

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: "name", order: "asc" });

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(sort);
    api(`/owner/dashboard?${params}`)
      .then((data) => {
        if (active) {
          setDashboard(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [sort]);

  const sortBy = (key) => {
    setLoading(true);
    setSort((current) => ({
      key,
      order: current.key === key && current.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortLabel = (key, label) => (
    <button className="link" type="button" onClick={() => sortBy(key)}>
      {label}{sort.key === key ? (sort.order === "asc" ? " ▲" : " ▼") : ""}
    </button>
  );

  return (
    <div className="card">
      <h2>Your store</h2>
      {error && <div className="err" role="alert">{error}</div>}
      {loading && <div className="empty">Loading your store…</div>}
      {!loading && !error && !dashboard?.store && (
        <div className="empty">No store has been assigned to your account yet.</div>
      )}
      {!loading && !error && dashboard?.store && (
        <>
          <div className="detail">
            <h2>{dashboard.store.name}</h2>
            <div>{dashboard.store.address}</div>
            <div>Average rating: <Stars v={dashboard.store.average} /></div>
            <div>{dashboard.store.total} customer ratings</div>
          </div>
          <h2 style={{ marginTop: 22 }}>Customer ratings</h2>
          <div className="wrap">
            <table>
              <thead>
                <tr>
                  <th>{sortLabel("name", "Customer")}</th>
                  <th>{sortLabel("email", "Email")}</th>
                  <th>{sortLabel("rating", "Rating")}</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.raters.map((rater) => (
                  <tr key={`${rater.email}-${rater.updated_at}`}>
                    <td>{rater.name}</td>
                    <td>{rater.email}</td>
                    <td><Stars v={rater.rating} /></td>
                    <td>{new Date(rater.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!dashboard.raters.length && <div className="empty">No customer ratings yet.</div>}
          </div>
        </>
      )}
    </div>
  );
}
