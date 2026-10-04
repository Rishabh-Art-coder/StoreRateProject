import "./App.css";
import Header from "./components/Header.jsx";
import AuthScreen from "./pages/AuthScreen.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const dashboards = { admin: AdminDashboard, user: UserDashboard, owner: OwnerDashboard };
const subtitles = {
  admin: 'Add stores and keep platform activity up to date.',
  user: 'Browse stores and share your ratings.',
  owner: 'Review every store and user on StoreRate.',
};

function App() {
  const { user } = useAuth();
  const Dashboard = user && dashboards[user.role];
  if (!Dashboard) return <AuthScreen />;
  return (
    <Header>
      <main>
        <div className="page-head">
          <h2>Welcome, {user.name.split(" ")[0]}</h2>
          <p>{subtitles[user.role]}</p>
        </div>
        <Dashboard />
      </main>
    </Header>
  );
}

export default App;
