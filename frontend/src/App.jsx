import "./App.css";
import Header from "./components/Header.jsx";
import AuthScreen from "./pages/AuthScreen.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Role ke hisaab se kaun sa dashboard dikhana hai.
const dashboards = { admin: AdminDashboard, user: UserDashboard, owner: OwnerDashboard };

const subtitles = {
  admin: 'Manage users and stores, and keep an eye on platform activity.',
  user: 'Browse stores and share your ratings.',
  owner: 'See how customers are rating your store.',
};


function App() {

  const { user } = useAuth();

  // if (!user) {
  //   return <AuthScreen />
  // }

  const Dashboard = dashboards[user.role];
  return (
    <>
      <Header>
        <main>

          <div className="page-head">
            {/* <h2>Welcome back ,{user.name.split(' ')[0]} </h2> */}
            <p></p>
          </div>
          <Dashboard />
          {/* {user.role !== 'admin' && <PasswordCard />} */}
        </main>
      </Header>
    </>
  );
}

export default App;
