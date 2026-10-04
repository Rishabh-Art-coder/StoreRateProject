import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ children }) {
  const { user, logout } = useAuth();
  return (
    <>
      <header>
        <div className="brand"><div className="logo">S</div><h1>StoreRate</h1></div>
        <div className="who">
          <div><b>{user.name}</b><small>{user.role}</small></div>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      </header>
      {children}
    </>
  );
}