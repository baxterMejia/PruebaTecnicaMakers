import { useEffect, useState } from 'react';
import { getPendingLoans, updateLoanStatus } from '../services/loanService';
import '../styles/loan.css';

function Admin() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const loadPendingLoans = async (pageToLoad = page) => {
        try {
            setLoading(true);
            const data = await getPendingLoans(pageToLoad, pageSize);
            setLoans(data);
            setHasMore(data.length === pageSize);
            setError(null);
        } catch {
            setError("No se pudieron cargar los préstamos pendientes");
            setLoans([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingLoans();
    }, [page]);

    const handleAction = async (loanId, newStatus) => {
        try {
            await updateLoanStatus(loanId, newStatus);
            setSuccessMessage(`Estado actualizado a "${newStatus}"`);
            await loadPendingLoans();

            // Limpiar mensaje luego de 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert("Error al actualizar estado: " + err.message);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            {loading ? (
                <p>Cargando préstamos pendientes...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <>
                    {loans.length === 0 ? (
                        <p>No hay préstamos pendientes.</p>
                    ) : (
                        loans.map((loan) => (
                            <div key={loan.id} className="loan-card border p-4 rounded-lg shadow mb-4">
                                <p><strong>ID:</strong> {loan.id}</p>
                                <p><strong>Monto:</strong> ${loan.amount.toLocaleString()}</p>
                                <p><strong>Plazo:</strong> {loan.termMonths} meses</p>
                                <p><strong>Usuario:</strong> {loan.user?.name}</p>
                                <p><strong>Estado:</strong> {loan.status}</p>

                                <div className="flex mt-4">
                                    <div className="mr-[100px]">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded shadow"
                                            onClick={() => handleAction(loan.id, 'Approved')}
                                        >
                                            Aprobar
                                        </button>
                                    </div>
                                    <hr></hr>
                                    <div>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded shadow"
                                            onClick={() => handleAction(loan.id, 'Rejected')}
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="paginator mt-6 flex items-center gap-4">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {page}</span>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={!hasMore}
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Admin;
