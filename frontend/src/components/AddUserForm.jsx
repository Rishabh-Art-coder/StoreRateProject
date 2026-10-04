import { useState } from "react";
import { api } from "../api/client.js";
import { firstError } from "../utils/validation.js";
import Field from "./Field.jsx";

export default function AddUserForm({ onDone }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    const validationError = firstError(form, ["name", "email", "address", "password"]);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      await api("/admin/users", { method: "POST", body: form });
      setForm({ name: "", email: "", address: "", password: "", role: "user" });
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
      <h2>Add a user</h2>
      <p className="sub">Create a customer, store owner, or administrator account.</p>
      <form onSubmit={submit}>
        <div className="grid2">
          <Field label="Full name" value={form.name} onChange={update("name")} maxLength={60} required />
          <Field label="Email" type="email" value={form.email} onChange={update("email")} required />
          <Field label="Address" value={form.address} onChange={update("address")} maxLength={400} required />
          <Field label="Password" type="password" value={form.password} onChange={update("password")} required />
          <div>
            <label htmlFor="new-user-role">Role</label>
            <select id="new-user-role" value={form.role} onChange={(event) => update("role")(event.target.value)}>
              <option value="user">Normal user</option>
              <option value="owner">Store owner</option>
              <option value="admin">System administrator</option>
            </select>
          </div>
        </div>
        {error && <div className="err" role="alert">{error}</div>}
        {saved && <div className="ok" role="status">User created successfully.</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Creating..." : "Create user"}</button>
      </form>
    </div>
  );
}
