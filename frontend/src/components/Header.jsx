export default function Header() {

  const user = "Rishabh";
  const logout = "Logout";

  // const {user , logout} = useAuth();
  return (

    
    <header>
      <h1>StoreRate</h1>
      <span> {user}</span>
      <button className="btn ghost" style={{ color: '#fff' }}>Logout</button>
    </header>
  )
}