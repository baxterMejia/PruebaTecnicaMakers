import { useState } from 'react'

function TaskForm({ tasks, setTasks }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask = {
      id: Date.now(),
      title,
      description: desc
    }

    setTasks([...tasks, newTask])
    setTitle('')
    setDesc('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="border p-2 mr-2"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2">Agregar</button>
    </form>
  )
}

export default TaskForm
