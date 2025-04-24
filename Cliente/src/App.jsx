import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Admin from "./pages/Admin";

function Sidebar() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = user?.role;
  const location = useLocation();

  if (location.pathname === "/login") return null;

  return (
    <aside className="sidebar">
      <h2>{role === "Admin" ? "🔧 Admin" : "👤 Cliente"}</h2>
      <nav>
        <ul>
          {role === "Admin" ? (
            <>
              <li><Link to="/admin">Pendientes</Link></li>              
            </>
          ) : (
            <>
              <li><Link to="/cliente">Mis Préstamos</Link></li>             
            </>
          )}
          <li><Link to="/login">Cerrar sesión</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit/:id" element={<EditTask />} />
            <Route path="/cliente" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
