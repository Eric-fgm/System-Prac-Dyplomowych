import { useState } from "react"
import axios from "axios"

export default function CreateThesisForm() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    student_id: "",
    supervisor_id: "",
    status: "draft",
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/theses/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Jeśli używasz tokenu autentykacji
        }
      })
      setSuccess(true)
      setError("")
    } catch (err) {
      setError("Nie udało się dodać pracy. " + err)
      setSuccess(false)
    }
  }

  return (
    <div className="max-w-md mx-auto border border-black p-6 rounded-lg bg-white text-black shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-center">Dodaj pracę inżynierską</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tytuł pracy</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-black px-3 py-2 bg-white text-black rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Opis pracy</label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            className="w-full border border-black px-3 py-2 bg-white text-black rounded"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">ID studenta</label>
          <input
            type="number"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="w-full border border-black px-3 py-2 bg-white text-black rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ID profesora</label>
          <input
            type="number"
            name="supervisor_id"
            value={formData.supervisor_id}
            onChange={handleChange}
            className="w-full border border-black px-3 py-2 bg-white text-black rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Dodaj pracę
        </button>

        {success && <p className="text-green-600 text-sm mt-2">Praca dodana pomyślnie.</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}
