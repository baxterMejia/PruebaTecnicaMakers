import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>🔧 Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin">Pendientes</Link></li>           
            <li><Link to="/login">Cerrar sesión</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
