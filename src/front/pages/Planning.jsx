import React, { useState, useEffect } from 'react';

//eliminar estas const y poner llamadas a la api de Arley en handleBuscar
const comidasDelDia = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'];

const recetasDummy = [
  'Tortilla de patatas',
  'Ensalada César',
  'Pollo al horno',
  'Arroz con leche',
  'Batido de frutas',
  'Sopa de verduras'
];

export const Planning = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [comidas, setComidas] = useState({
    Desayuno: [],
    Almuerzo: [],
    Cena: [],
    Merienda: []
  });

  // Cargar datos previos si existen
  useEffect(() => {
    const datosGuardados = localStorage.getItem('comidas');
    if (datosGuardados) {
      setComidas(JSON.parse(datosGuardados));
    }
  }, []);

  const handleBuscar = (evento) => {
    const textoBuscado = evento.target.value;
    setBusqueda(textoBuscado);
  
    const textoSinEspacios = textoBuscado.trim();
  
    if (textoSinEspacios === '') {
      //Limpiar los resultados en el caso de no haber escrito nada
      setResultados([]);
      return;
    }
  
    // Pasan las recipes a minúsculas y se compara el resultado
    const recetasCoincidentes = recetasDummy.filter((receta) => {
      const recetaEnMinuscula = receta.toLowerCase();
      const textoEnMinuscula = textoSinEspacios.toLowerCase();
      return recetaEnMinuscula.includes(textoEnMinuscula);
    });
  
    setResultados(recetasCoincidentes);
  };
  const añadirReceta = (comida, receta) => {
    setComidas(prev => ({
      ...prev,
      [comida]: [...prev[comida], receta]
    }));
    setBusqueda('');
    setResultados([]);
  };

  const guardarDatos = () => {   // guarda en localStorage como JSON
    localStorage.setItem('comidas', JSON.stringify(comidas));
    alert('¡Datos guardados correctamente!');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Comidas del día</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar receta..."
        value={busqueda}
        onChange={handleBuscar}
      />

      {resultados.length > 0 && (
        <div className="mb-3">
          <p>Selecciona una comida para añadir la receta:</p>
          {comidasDelDia.map((comida) => (
            <div key={comida} className="mb-2">
              <strong>{comida}:</strong>{' '}
              {resultados.map((receta, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => añadirReceta(comida, receta)}
                >
                  {receta}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Comida</th>
            <th>Recetas Añadidas</th>
          </tr>
        </thead>
        <tbody>
          {comidasDelDia.map((comida) => (
            <tr key={comida}>
              <td><strong>{comida}</strong></td>
              <td>
              {comidas[comida].length > 0 ? (
                  <ul className="mb-0">
                    {comidas[comida].map((receta, i) => (
                      <li key={i}>{receta}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted">Sin recetas aún</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-warning mt-3" onClick={guardarDatos}>
        Guardar información
      </button>
    </div>
  );
}
