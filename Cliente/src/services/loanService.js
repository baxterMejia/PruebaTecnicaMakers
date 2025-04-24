const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => sessionStorage.getItem('token');


const handleUnauthorized = () => {
    sessionStorage.clear();
    window.location.href = '/login';
};

export const getLoansByUser = async (userId, page = 1, pageSize = 10) => {
    const res = await fetch(`${API_URL}/loan/user/${userId}?page=${page}&pageSize=${pageSize}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    if (res.status === 401) {
        handleUnauthorized();
        return;
    }

    if (!res.ok) throw new Error('Error al obtener préstamos');

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

export const requestLoan = async (loanData) => {
    const res = await fetch(`${API_URL}/loan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(loanData)
    });

    if (res.status === 401) {
        handleUnauthorized();
        return;
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(err.error || 'Error al solicitar préstamo');
    }

    return await res.text();
};

export const getPendingLoans = async (page = 1, pageSize = 5) => {
    const res = await fetch(`${API_URL}/loan/pending?page=${page}&pageSize=${pageSize}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    if (res.status === 401) {
        sessionStorage.clear();
        window.location.href = '/login';
        return;
    }

    if (!res.ok) throw new Error('Error al obtener préstamos pendientes');
    return await res.json();
};

export const updateLoanStatus = async (loanId, newStatus) => {
    const res = await fetch(`${API_URL}/loan/${loanId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(newStatus) // el backend espera string puro
    });

    if (res.status === 401) {
        sessionStorage.clear();
        window.location.href = '/login';
        return;
    }

    if (!res.ok) throw new Error('Error al actualizar estado');
};

