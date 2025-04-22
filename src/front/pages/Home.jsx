import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Carousel, Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { RecetaCard} from "../components/RecetaCard";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location =useLocation();
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const foodCategories = [
    {
      name: "Desayuno",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
      description: "Comienza tu día con energía"
    },
    {
      name: "Almuerzo",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      description: "Recetas sustanciosas para mediodía"
    },
    {
      name: "Cena",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      description: "Platos ligeros para terminar el día"
    },
    {
      name: "Vegano",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      description: "Delicias 100% vegetales"
    },
    {
      name: "Vegetariano",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      description: "Sabores naturales y frescos"
    }
  ];
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchREcipes = async () => {
      if (!searchQuery) return;
      
      setLoading(true);
      setError(null);

      try {
        const endpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchQuery}&number=6&addRecipeInformation=true`;
        const response = await axios.get(endpoint);
        setRecipes(response.data.results || []);
      } catch (err) {
        setError("Error al buscar recetas. Intenta nuevamente.");
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchREcipes();
  }, [searchQuery]);

  return (
    <div className="container">
        <h1 className="display-4 fw-bold mb-4 text-center py-3 text-info" style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}>
           {searchQuery ? `Resultados para: ${searchQuery}` : "Bienvenidos a Qué, Como y Cuánto"}
        </h1>

        {searchQuery ? (
          <div className="my-5">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="info" />
                <p>Buscando recetas...</p>
              </div>  
            ) : error ? (
              <div className="alert alert-danger text-center">
                {error}
                {error.includes('402') && (
                  <p>Límite de búsquedas alcanzado. Prueba de nuevo mañana.</p>
                )}
              </div>  
            ) : recipes.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {recipes.map((recipe) =>(
                  <Col key={recipe.id}>
                    <RecetaCard receta={recipe} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <h4>No se encontraron recetas para "{searchQuery}"</h4>
                <button variant="outline-info" href="/">
                Volver al inicio
                </button>
              </div>  
            )}
          </div>  
        ) : (
          <>        
        
        <h5 className="display-6 fw-bold mb-4 text-center py-3">En esta pagina podras encontrar:</h5>
      <Carousel interval={3000} pause={false}>
        {foodCategories.map((category, index) => (
          <Carousel.Item key={index}>
            <div style={{ height: "300px", overflow: "hidden"}}>
              
              <img
                className="d-block w-100 h-100"
                src={category.image}
                alt={category.name}
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />                          
            </div>
            <Carousel.Caption style={{ background: "rgba(0,0,0,0.5)", borderRadius: "10px" }}>
              <h3>{category.name}</h3>
              <p>{category.description}</p> 
              <Button 
              variant="info"
              href={`/recipes?category=${category.name.toLowerCase()}`}
              >Ver recetas 
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
     </>
    )} 
    </div>
  );
};

