import "./styles/tokens.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AppProvider }           from "./context/AppContext.jsx";
import { LoginPage }             from "./pages/LoginPage.jsx";
import { DashboardPage }         from "./pages/DashboardPage.jsx";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginPage />;

  return (
    <AppProvider>
      <DashboardPage />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
