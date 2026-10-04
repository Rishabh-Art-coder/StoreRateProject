import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Field from "./Field.jsx";

export default function AddForm({ onDone }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/admin/owners").then(setOwners).catch((requestError) => setError(requestError.message));
  }, []);

  const update = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Store name, email, and address are required.");
      return;
    }
    setBusy(true);
    try {
      await api("/admin/stores", { method: "POST", body: form });
      setForm({ name: "", email: "", address: "", ownerId: "" });
      setSaved(true);
      onDone();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Add a store</h2>
      <p className="sub">Store owners are optional and can be assigned now or later.</p>
      <form onSubmit={submit}>
        <div className="grid2">
          <Field label="Store name" value={form.name} onChange={update("name")} />
          <Field label="Store email" type="email" value={form.email} onChange={update("email")} />
          <Field label="Address" value={form.address} onChange={update("address")} />
          <div>
            <label htmlFor="store-owner">Store owner (optional)</label>
            <select id="store-owner" value={form.ownerId} onChange={(event) => update("ownerId")(event.target.value)}>
              <option value="">Unassigned</option>
              {owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="err" role="alert">{error}</div>}
        {saved && <div className="ok" role="status">Store added successfully.</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Adding..." : "Add store"}</button>
      </form>
    </div>
  );
}
