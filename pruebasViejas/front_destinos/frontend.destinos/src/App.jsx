import './App.css'
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/destinos';

const Destinos = () => {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDestino, setEditingDestino] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pais: '',
    disponible: true
  });

  // Fetch destinos on mount
  useEffect(() => {
    fetchDestinos();
  }, []);

  const fetchDestinos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar destinos');
      const data = await response.json();
      setDestinos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDestino
        ? `${API_URL}/${editingDestino.id}`
        : API_URL;
      const method = editingDestino ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar destino');

      await fetchDestinos();
      resetForm();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (destino) => {
    setEditingDestino(destino);
    setFormData({
      nombre: destino.nombre,
      descripcion: destino.descripcion,
      pais: destino.pais,
      disponible: destino.disponible
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este destino?')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar destino');
      await fetchDestinos();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      pais: '',
      disponible: true
    });
    setEditingDestino(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Carga de Destinos  </h1>
          
    
          <button
             
            onClick={() => setShowForm(true)}
            
            className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
           
            <Plus size={12}  />
             
              Agregar nuevo Destino
          </button>
       
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
            <h2 className="text-xl font-semibold mb-4">
              {editingDestino ? 'Editar Destino' : 'Nuevo Destino'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="titulo-input">
                      Nombre del Destino
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: París, Francia"
                    />
                  </div>
                  <div>
                    <label className="titulo-input">
                      pais
                    </label>
                    <input
                      type="number"
                      name="pais"
                      value={formData.pais}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="titulo-input">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción del destino..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="titulo-input">
                    Disponible
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type='submit'
                    className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    {editingDestino ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-black px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Lista de destinos */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {destinos.map((destino) => (
    <div
      key={destino.id}
      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-bold text-gray-800">{destino.nombre}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            destino.disponible
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {destino.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{destino.descripcion}</p>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-blue-600">
          ${Number(destino.pais).toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(destino)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-md transition-colors"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDelete(destino.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

       

        {destinos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">(No hay destinos registrados)</p>
            <p className="text-gray-400">Agregá el primer destino haciendo clic en "Nuevo Destino"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinos;
