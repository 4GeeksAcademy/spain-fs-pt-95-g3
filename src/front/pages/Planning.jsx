import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Calendar from "./Calendar";

const comidasDelDia = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'];
const baseUrl = import.meta.env.VITE_API_URL;

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
  const [todayMeals, setTodayMeals] = useState([]);

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('comidas');
    if (datosGuardados) {
      setComidas(JSON.parse(datosGuardados));
    }
  }, []);

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
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchToday = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/meals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const today = new Date().toISOString().split('T')[0];
        setTodayMeals(data.filter(m => m.date === today));
      } catch (err) {
        console.error('Error al cargar comidas de hoy:', err);
      }
    };
    fetchToday();
  }, []);

  const savePlanning = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert('No estás autenticado');
      return;
    }
  
    // fecha actual en formato YYYY-MM-DD
    const dateToday = new Date().toISOString().split("T")[0];
  
    setSaving(true);
  
    try {
      const tasks = [];
  
      comidasDelDia.forEach(comida => {
        comidas[comida].forEach(receta => {
          tasks.push(
            fetch(`${baseUrl}/api/meals`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                name: comida,
                description: receta.title,
                calorías: receta.calories,
                date: dateToday
              })
            }).then(async res => {
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error desconocido');
              }
              return res.json();
            })
          );
        });
      });
  
      await Promise.all(tasks);
  
      alert('¡Planificación guardada en el servidor!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };  
  
  return (
    <div className="container mt-4">
      <div className="row">
      
      <h1 className="text-center mb-4"
      style={{
        color: "#2c3e50",
        fontWeight: "700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        paddingBottom: "10px"
      }}>Planificación de comidas</h1>
      <div className="col-md-8">
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
              onKeyUp={(e) => e.key === 'Enter' && agregarIngrediente()}
            />
            <button className="btn btn-warning" 
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

      {/* info carga y errores */}
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
                          className="btn btn-outline-info w-100 mb-2"
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
        onClick={savePlanning}
        disabled={
          saving ||
          Object.values(comidas).every(arr => arr.length === 0)
        }
      >
        {saving ? 'Guardando…' : 'Guardar planificación'}
      </button>
      
        </div>
        
      </div>
      <div className="card mt-4 shadow-sm">
  <div className="card-header bg-warning">
    <h5 className="mb-0">Comidas de hoy</h5>
  </div>
  <div className="card-body">
    {todayMeals.length > 0 ? (
      <ul className="list-group list-group-flush">
        {todayMeals.map(meal => (
          <li
            key={meal.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{meal.name}:</strong> {meal.description}
            </div>
            <small className="text-muted">{meal.date}</small>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted mb-0">
        Aún no has registrado ninguna comida hoy.
      </p>
    )}
    </div>
  
      </div>
      </div>
      <div className="col-md-4">
      <Calendar />
      </div>
      </div>
    </div>
  );
};      