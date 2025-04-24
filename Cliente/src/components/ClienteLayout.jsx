import { Link } from "react-router-dom";

export default function ClienteLayout({ children }) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>👤 Cliente</h2>
        <nav>
          <ul>
            <li><Link to="/cliente">Mis Préstamos</Link></li>            
            <li><Link to="/login">Cerrar sesión</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
