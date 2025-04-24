🏦 Sistema de Gestión de Préstamos Bancarios

Proyecto full-stack que simula la administración de préstamos bancarios. Incluye:
- API REST en .NET 8
- Frontend en React
- Autenticación JWT
- Roles: Admin / Cliente
- SQLite como base de datos embebida

📁 Estructura del Proyecto
/APIPrestamos         → API en .NET 8
/Cliente            → Interfaz cliente en React

🚀 Requisitos

Backend
- .NET 8 SDK
- SQLite (no necesitas instalar nada extra)
- Visual Studio / VS Code

Frontend
- Node.js 18+
- NPM o Yarn

🔧 Cómo ejecutar el proyecto

🔙 Backend (API)
1. Ve a la carpeta del backend:
   cd APIPrestamos

2. Restaura los paquetes y compila:
   dotnet restore
   dotnet build

3. Ejecuta el proyecto:
   dotnet run

4. Swagger disponible en:
   https://localhost:7266/swagger

✅ Usuarios por defecto:
- Admin: admin / admin123
- Cliente: cliente / cliente123

🔝 Frontend (React)
1. Ve a la carpeta del frontend:
   cd frontend

2. Instala las dependencias:
   npm install

3. Crea un archivo .env con la URL del backend:
   VITE_API_URL=https://localhost:7266/api

4. Levanta la app:
   npm run dev

✅ Disponible en:
   http://localhost:5173

🔐 Roles y funcionalidades

Cliente
- Inicia sesión
- Solicita préstamos
- Consulta su historial

Admin
- Inicia sesión
- Ve préstamos pendientes
- Aprueba o rechaza solicitudes

🧠 Recomendaciones

- Usa dotnet watch run para desarrollo ágil.
- Usa navegadores modernos (Chrome, Edge).
- Si usas HTTPS, acepta el certificado en tu navegador.
- Para producción, reemplaza SQLite por SQL Server o PostgreSQL.
- Implementa manejo de expiración de tokens en el frontend (ya incluido).
- Evita exponer los datos sensibles en el frontend (como contraseñas en consola).

✅ TODOs sugeridos

- [x] Test unitarios en capa de servicios (No se completo por tiempo)

✨ Créditos

Desarrollado por Johan Sebastian Mejia Carmona
johanmejiac@hotmail.com
