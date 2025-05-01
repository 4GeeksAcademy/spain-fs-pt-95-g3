import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Spinner,
  Card,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useFavorites } from "../Context/FavoritesContext";

export const DetallReceta = () => {
  const API_BASE_URL = "https://api.spoonacular.com/recipes";
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite } = useFavorites();

  const fetchRecetaCompleta = async () => {
    try {
      const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
      const response = await axios.get(
        `${API_BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
      );

      const recetasDetalladas =
        JSON.parse(localStorage.getItem("recetasDetalladas")) || {};
      recetasDetalladas[id] = response.data;
      localStorage.setItem("recetasDetalladas", JSON.stringify(recetasDetalladas));

      setReceta(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedRecetas = JSON.parse(localStorage.getItem("recetasDetalladas")) || {};
    if (cachedRecetas[id]) {
      setReceta(cachedRecetas[id]);
      setLoading(false);
    } else {
      fetchRecetaCompleta();
    }
  }, [id]);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  if (!receta) return <div className="alert alert-danger">Receta no encontrada</div>;

  const macros = receta.nutrition?.nutrients?.filter((n) =>
    ["Calories", "Protein", "Fat", "Carbohydrates"].includes(n.name)
  );

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Columna izquierda: Imagen + Info general */}
        <Col md={6}>
          <Card className="shadow p-3">
            <Card.Img
              src={receta.image}
              alt={receta.title}
              variant="top"
              className="rounded"
              onError={(e) => {
                e.target.src = "/img/receta-default.jpg";
              }}
            />
            <Card.Body>
              <Card.Title>{receta.title}</Card.Title>
              <p>{receta.summary.replace(/<[^>]*>/g, "")}</p>

              <Row className="my-3">
                <Col>
                  <Badge bg="info">⏱ {receta.readyInMinutes} min</Badge>
                </Col>
                <Col>
                  <Badge bg="success">🍽 {receta.servings} porciones</Badge>
                </Col>
              </Row>

              {macros && (
                <>
                  <h5 className="mt-4">Información Nutricional</h5>
                  <ListGroup horizontal className="flex-wrap">
                    {macros.map((macro) => (
                      <ListGroup.Item key={macro.name} className="text-center flex-fill">
                        <strong>{macro.name}</strong>
                        <br />
                        <Badge bg="secondary">
                          {macro.amount} {macro.unit}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}

              <div className="d-flex gap-2 mt-4">
                <Button
                  variant="warning"
                  className="w-100"
                  onClick={() => addFavorite(receta)}
                >
                  ⭐ Añadir a Favoritos
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => {
                    const texto = receta.extendedIngredients
                      .map((i) => i.original)
                      .join("\n");
                    navigator.clipboard.writeText(texto);
                    alert("Ingredientes copiados al portapapeles");
                  }}
                >
                  📋 Copiar Ingredientes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha: Ingredientes + Instrucciones */}
        <Col md={6}>
          <Card className="shadow p-3 h-100">
            <Card.Body>
              <h4>🧂 Ingredientes</h4>
              <ul>
                {receta.extendedIngredients.map((ingrediente) => (
                  <li key={ingrediente.id}>{ingrediente.original}</li>
                ))}
              </ul>

              <h4 className="mt-4">👨‍🍳 Instrucciones</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: receta.instructions || "No hay instrucciones disponibles",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};