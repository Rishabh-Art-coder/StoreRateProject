import { useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import AuthScreen from "./pages/AuthScreen.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ChangePasswordForm from "./components/ChangePasswordForm.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const dashboards = { admin: AdminDashboard, user: UserDashboard, owner: OwnerDashboard };
const subtitles = {
  admin: 'Manage stores and review platform users.',
  user: 'Browse stores and share your ratings.',
  owner: 'Track your store and review customer ratings.',
};

function App() {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const Dashboard = user && dashboards[user.role];
  if (!Dashboard) return <AuthScreen />;
  return (
    <Header>
      <main>
        <div className="page-head">
          <h2>Welcome, {user.name.split(" ")[0]}</h2>
          <p>{subtitles[user.role]}</p>
          <button className="link" type="button" onClick={() => setShowPasswordForm((shown) => !shown)}>
            {showPasswordForm ? "Hide password form" : "Change password"}
          </button>
        </div>
        {showPasswordForm && <ChangePasswordForm />}
        <Dashboard />
      </main>
    </Header>
  );
}

export default App;
