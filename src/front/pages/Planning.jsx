import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const comidasDelDia = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'];

export const Planning = () => {
  
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [comidas, setComidas] = useState({
    Desayuno: [],
    Almuerzo: [],
    Cena: [],
    Merienda: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('comidas');
    if (datosGuardados) {
      setComidas(JSON.parse(datosGuardados));
    }
  }, []);

  /*Función debounce para optimizar las llamadas a la API
    Espera 500ms después de la última pulsación para ejecutar
   */
  const buscarRecetasPorIngrediente = useCallback(
    debounce(async (ingrediente) => {
      if (!ingrediente.trim() || ingrediente.trim().length < 1) {
        setResultados([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Endpoint para buscar por ingredientes
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/findByIngredients`, 
          {
            params: {
              apiKey: API_KEY,
              ingredients: ingrediente,
              number: 10, // Limitar resultados
              ranking: 1, // Ordenar por mejor coincidencia
              ignorePantry: true // Ignorar ingredientes básicos
            }
          }
        );
        
        setResultados(response.data);
      } catch (err) {
        setError('Error al buscar recetas. Intenta nuevamente.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [API_KEY]
  );

 
   /* Maneja el cambio en el input de búsqueda*/
  const handleBuscar = (evento) => {
    const texto = evento.target.value;
    setBusqueda(texto);
    buscarRecetasPorIngrediente(texto);
  };

  /*Maneja el cambio en el input de ingredientes*/
  const handleIngredientesChange = (evento) => {
    setBusqueda(evento.target.value);
  };

  /*Añade un ingrediente a la lista y busca recetas*/
  const agregarIngrediente = () => {
    if (busqueda.trim() && !ingredientes.includes(busqueda.trim().toLowerCase())) {
      const nuevoIngrediente = busqueda.trim();
      setIngredientes([...ingredientes, nuevoIngrediente]);
      buscarRecetasPorIngredientes([...ingredientes, nuevoIngrediente].join(','));
      setBusqueda('');
    }
  };

  /*Busca recetas por múltiples ingredientes*/
  const buscarRecetasPorIngredientes = useCallback(
    debounce(async (ingredientesStr) => {
      if (!ingredientesStr) {
        setResultados([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/findByIngredients`, 
          {
            params: {
              apiKey: API_KEY,
              ingredients: ingredientesStr,
              number: 10,
              ranking: 1,
              ignorePantry: true
            }
          }
        );
        
        setResultados(response.data);
      } catch (err) {
        setError('Error al buscar recetas. Intenta nuevamente.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [API_KEY]
  );

  /*Elimina un ingrediente de la lista y vuelve a buscar*/
  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes.splice(index, 1);
    setIngredientes(nuevosIngredientes);
    
    if (nuevosIngredientes.length > 0) {
      buscarRecetasPorIngredientes(nuevosIngredientes.join(','));
    } else {
      setResultados([]);
    }
  };

  /*Añade una receta a una comida del día*/
  const addRecipe = (comida, receta) => {
    setComidas(prev => ({
      ...prev,
      [comida]: [...prev[comida], receta]
    }));
    setBusqueda('');
    setResultados([]);
  };

  /*Guarda las recetas asignadas en localStorage*/
  const saveData = () => {
    localStorage.setItem('comidas', JSON.stringify(comidas));
    alert('¡Planificación guardada correctamente!');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Planificación de comidas</h2>

      {/* Sección de búsqueda por ingredientes */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Buscar recetas por ingredientes</h5>
          
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ej: pollo, arroz, tomate..."
              value={busqueda}
              onChange={handleIngredientesChange}
              onKeyPress={(e) => e.key === 'Enter' && agregarIngrediente()}
            />
            <button 
              className="btn btn-primary" 
              onClick={agregarIngrediente}
              disabled={!busqueda.trim()}
            >
              Añadir ingrediente
            </button>
          </div>

          {/* Lista de ingredientes activos */}
          {ingredientes.length > 0 && (
            <div className="mb-3">
              <h6>Ingredientes seleccionados:</h6>
              <div className="d-flex flex-wrap gap-2">
                {ingredientes.map((ingrediente, index) => (
                  <span key={index} className="badge bg-info text-dark">
                    {ingrediente}
                    <button 
                      className="btn-close btn-close-white ms-2" 
                      onClick={() => eliminarIngrediente(index)}
                      style={{ fontSize: '0.5rem' }}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback de carga y errores */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Buscando recetas con tus ingredientes...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
          {error.includes('402') && (
            <p className="mt-2">Límite de la API alcanzado. Prueba con menos ingredientes o intenta más tarde.</p>
          )}
        </div>
      )}

      {/* Resultados de búsqueda */}
      {resultados.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Recetas encontradas</h5>
            <p className="card-text">Selecciona una comida para añadir la receta:</p>
            
            <div className="row">
              {comidasDelDia.map((comida) => (
                <div key={comida} className="col-md-3 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <strong>{comida}</strong>
                    </div>
                    <div className="card-body">
                      {resultados.map((receta) => (
                        <button
                          key={receta.id}
                          className="btn btn-outline-success w-100 mb-2"
                          onClick={() => addRecipe(comida, receta)}
                        >
                          {receta.title}
                          <span className="badge bg-secondary ms-2">
                            {receta.usedIngredientCount} ingredientes
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Planificación actual */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Tu planificación</h5>
          
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Comida</th>
                <th>Recetas asignadas</th>
              </tr>
            </thead>
            <tbody>
              {comidasDelDia.map((comida) => (
                <tr key={comida}>
                  <td><strong>{comida}</strong></td>
                  <td>
                    {comidas[comida].length > 0 ? (
                      <ul className="list-unstyled">
                        {comidas[comida].map((receta, i) => (
                          <li key={i}>
                            {receta.title}
                            {receta.missedIngredients && receta.missedIngredients.length > 0 && (
                              <small className="text-muted ms-2">
                                (Faltan: {receta.missedIngredients.map(ing => ing.name).join(', ')})
                              </small>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">No hay recetas asignadas</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            className="btn btn-warning mt-3" 
            onClick={saveData}
            disabled={Object.values(comidas).every(arr => arr.length === 0)}
          >
            Guardar planificación
          </button>
        </div>
      </div>
    </div>
  );
};      