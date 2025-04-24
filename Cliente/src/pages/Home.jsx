import { useEffect, useState } from 'react';
import { getLoansByUser, requestLoan } from '../services/loanService';
import '../styles/loan.css';

function Home() {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Puedes ajustar

  const user = JSON.parse(sessionStorage.getItem('user'));

  const loadLoans = async (pageToLoad = page) => {
    try {
      setLoading(true);
      const data = await getLoansByUser(user.id, pageToLoad, pageSize);
      setLoans(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los préstamos");
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadLoans();
  }, [page]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!amount || !term) return alert("Completa todos los campos");

    try {
      await requestLoan({
        id: 0,
        amount: parseFloat(amount),
        termMonths: parseInt(term),
        status: "Pending",
        userId: user.id
      });

      setAmount('');
      setTerm('');
      setPage(1); // reset a primera página
      await loadLoans(1);
    } catch (err) {
      alert(err.message || "Error al solicitar préstamo");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user?.name}</h1>

      <form onSubmit={handleRequest} className="loan-form">
        <h2>Solicitar nuevo préstamo</h2>
        <div className="form-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto"
          />
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Plazo (meses)"
          />
        </div>
        <button type="submit">Solicitar préstamo</button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Mis préstamos</h2>

      {loading ? (
        <p>Cargando préstamos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {loans.length === 0 ? (
            <p>No tienes préstamos en esta página.</p>
          ) : (
            loans.map((loan, i) => (
              <div key={i} className="loan-card">
                <p><strong>Monto:</strong> ${loan.amount.toLocaleString()}</p>
                <p><strong>Plazo:</strong> {loan.termMonths} meses</p>
                <p className={`loan-status status ${loan.status.toLowerCase()}`}>
                  Estado: {loan.status}
                </p>
              </div>
            ))
          )}

          <div className="paginator">
            <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>
              Anterior
            </button>
            <span>Página {page}</span>
            <button onClick={() => setPage(prev => prev + 1)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
