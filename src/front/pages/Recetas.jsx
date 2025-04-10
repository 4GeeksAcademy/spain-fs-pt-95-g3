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

  const fetchRecetas = async (searchQuery = "", resetOffset = true) => {

    if(resetOffset) setOffset(0);
    setLoading(true);
    setError(null);

    try {
      let endpoint;
      let response;

      if (!searchQuery) {
        const cachedRecetas = localStorage.getItem('cachedRecetas');
        if (cachedRecetas) {
          setRecetas(JSON.parse(cachedRecetas));
          setLoading(false);
          return;
        }
      }

      if(searchQuery) {
        endpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(searchQuery)}&number=9&addRecipeInformation=true`;
        response = await axios.get(endpoint);
        setRecetas(response.data.results); }
        else {
          endpoint = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9`;
          response = await axios.get(endpoint);
          setRecetas(response.data.recipes);          
        }

        if (!searchQuery) {
          localStorage.setItem('cachedRecetas', JSON.stringify(response.data.recipes || []));
        }
      } catch (err) {
        setError("Error al cargar las recetas. Por favor intenta más tarde.");
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      const cachedRecetas = localStorage.getItem('cachedRecetas');
      if(cachedRecetas && !query) {
        setRecetas(JSON.parse(cachedRecetas));
        setLoading(false);
      } else {
        fetchRecetas();
      }
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
          <div className="alert alert-danger">
            <h5>¡Ups! Algo salío mal</h5>
            <p>{error}</p>
            {error.includes('402') && (
              <p>Límite de búsquedas alcanzado. Prueba de nuevo mañana.</p>
            )}
          </div>
          <Button variant="primary" onClick={() => fetchRecetas()}>
            Reintentar
          </Button>
        </Container>
      );
    }

    return (
    <Container className="my-5 p-4 rounded-3"
    style={{
      background: "linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1"
    }}>
      <h1 className="text-center mb-4"
      style={{
        color: "#2c3e50",
        fontWeight: "700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        paddingBottom: "10px"
      }}>Nuestras Recetas
      <span style={{
              content: "",
              display: "block",
              width: "80px",
              height: "4px",
              background: "#3498db",
              margin: "10px auto 0",
              borderRadius: "2px"
      }}></span></h1>
      
      <Form 
        onSubmit={handleSearch}
        className="mb-4 p-3 rounded"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blr(5px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
        <div className="d-flex">
          <Form.Control 
            type="search"
            placeholder="🔍 Buscar recetas (ej. ensalada, pollo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="me-2 py-2 border-0 shadow-sm"
            style={{borderRadius: "12px"}} 
          />
          <Button
           variant="info"
           type="submit"
           className="px-4"
           style={{
            borderRadius: "12px",
            frontWeight: "600",
            background: "linear-gradient(135deg,rgb(125, 229, 236) 0%,rgb(240, 243, 247) 100%)",
            border: "none"
           }}>
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