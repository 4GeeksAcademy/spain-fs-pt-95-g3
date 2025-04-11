import React, { useState } from "react";

export const Favorites = () => {
    // Más adelante hay que borrar y hacer fetch a la api
    // const Favorites = ({ favorites }) => {
    
    const [activeTab, setActiveTab] = useState('recipes'); // recetas o alimentos

    // Ejemplos simulados
  const favoriteRecipes = [
    { name: 'Ensalada César', description: 'Pollo, lechuga y aderezo César.', image: 'https://via.placeholder.com/150' },
    { name: 'Pizza Margarita', description: 'Tomate, mozzarella y albahaca.', image: 'https://via.placeholder.com/150' }
  ];

  const favoriteFoods = [
    { name: 'Manzana', description: 'Fruta fresca y saludable.', image: 'https://via.placeholder.com/150' },
    { name: 'Yogur', description: 'Yogur natural bajo en grasas.', image: 'https://via.placeholder.com/150' }
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Mis Favoritos</h2>
      
      {/* Botones para cambiar de pestaña */}
      <div className="btn-group mb-4">
        <button 
          className={`btn ${activeTab === 'recipes' ? 'btn-info' : 'btn-outline-primary'}`} 
          onClick={() => setActiveTab('recipes')}
        >
          Recetas Favoritas
        </button>
        <button 
          className={`btn ${activeTab === 'foods' ? 'btn-info' : 'btn-outline-primary'}`} 
          onClick={() => setActiveTab('foods')}
        >
          Alimentos Favoritos
        </button>
      </div>

      <div className="row">
        {activeTab === 'recipes' && favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100">
                <img src={item.image} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === 'foods' && favoriteFoods.length > 0 ? (
          favoriteFoods.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100">
                <img src={item.image} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes favoritos guardados aún en esta categoría.</p>
        )}
      </div>
    </div>
  );
};
  
