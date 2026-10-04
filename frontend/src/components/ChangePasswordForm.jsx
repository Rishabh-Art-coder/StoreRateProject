import { useState } from "react";
import { api } from "../api/client.js";
import { firstError } from "../utils/validation.js";
import Field from "./Field.jsx";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    const validationError = firstError({ password }, ["password"]);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await api("/auth/password", { method: "PUT", body: { password } });
      setPassword("");
      setConfirmation("");
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Change password</h2>
      <form onSubmit={submit}>
        <div className="grid2">
          <Field label="New password" type="password" value={password} onChange={setPassword} required />
          <Field label="Confirm new password" type="password" value={confirmation} onChange={setConfirmation} required />
        </div>
        {error && <div className="err" role="alert">{error}</div>}
        {saved && <div className="ok" role="status">Password updated successfully.</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Updating..." : "Update password"}</button>
      </form>
    </div>
  );
}
