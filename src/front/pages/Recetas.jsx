import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { RecetaCard } from "../components/RecetaCard";
import axios from "axios";

export const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  const fetchRecetas = async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      let endpoint;
      let response;

      if(searchQuery) {
        endpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchQuery}&number=9&addRecipeInformation=true`;
        response = await axios.get(endpoint);
        setRecetas(response.data.result); }
        else {
          endpoint = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9`;
          response = await axios.get(endpoint);
          setRecetas(response.data.recipes);
        }
      } catch (err) {
        setError("Error al cargar las recetas. Por favor intenta más tarde.");
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchRecetas();
    }, []);

    const handleSearch = (e) => {
      e.preventDefault();
      fetchRecetas(query);
    };

    if (loading) {
      return (
        <Container className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando recetas...</p>
        </Container>
      );
    }
    
    if(error) {
      return (
        <Container className="text-center my-5">
          <div className="alert alert-danger">{error}</div>
          <Button variant="primary" onClick={() => fetchRecetas()}>
            Reintentar
          </Button>
        </Container>
      );
    }

    return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Nuestras Recetas</h1>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex">
          <Form.Control 
            type="search"
            placeholder="Buscar recetas (ej. ensalada, pollo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="me-2" 
          />
          <Button variant="primary" type="submit">
            Buscar
          </Button>        
        </div>
      </Form>

      {recetas.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {recetas.map((receta) => (
            <Col key={receta.id}>
              <RecetaCard receta={receta} />
            </Col>
        ))}
      </Row>
      ) : (
        <div className="text-center py-5">
          <h4>No se encontraron recetas</h4>
          <Button variant="outline-primary" onClick={() => fetchRecetas()}>
            Mostrar recetas aleatorias
          </Button>
        </div>
      )}  
    </Container>
  );
};