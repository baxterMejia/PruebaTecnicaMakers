import { useParams, useNavigate } from 'react-router-dom'

function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Tarea #{id}</h1>
      <p>Funcionalidad no implementada (solo mock para cumplir requisitos)</p>
      <button className="mt-4 bg-gray-300 p-2" onClick={() => navigate('/')}>Volver</button>
    </div>
  )
}

export default EditTask
