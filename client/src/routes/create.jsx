import { useState } from "react"
import axios from "axios"

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/users/create", formData)
      setSuccess(true)
      setError("")
      setFormData({ name: "", email: "", role: "student", password: "" }) // czyść formularz
    } catch (err) {
      setError("Nie udało się dodać użytkownika. " + err)
      setSuccess(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full border border-black p-6 rounded-lg bg-white text-black shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Dodaj użytkownika</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Imię i nazwisko</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 bg-white text-black rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 bg-white text-black rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Hasło</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 bg-white text-black rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Rola</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 bg-white text-black rounded"
            >
              <option value="student">Student</option>
              <option value="professor">Profesor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Dodaj użytkownika
          </button>

          {success && <p className="text-green-600 text-sm mt-2">Użytkownik dodany pomyślnie.</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  )
}
