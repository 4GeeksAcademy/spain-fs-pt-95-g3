import { useFavorites } from "../Context/FavoritesContext";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

export const Favorites = () => {

  const { favorites, removeFavorite } = useFavorites();
  const [hoveredId, setHoveredId] = useState(null);

  const handleRemove = async (e, recetaId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Debes estar logueado para usar favoritos");
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${recetaId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      removeFavorite(recetaId);
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4" style={{
        color: "#2c3e50",
        fontWeight: "700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        paddingBottom: "10px"
      }}>
        Mis recetas favoritas
      </h1>

      {favorites.length === 0 ? (
        <p>No tienes recetas favoritas aún.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {favorites.map((receta) => {
            const title = receta.title || receta.name;
            const image = receta.image || "https://via.placeholder.com/300";
            const summary = receta.summary || receta.instructions || "Descripción no disponible";

            return (
              <Col key={receta.id}>
                <Card
                  className="h-100 shadow rounded"
                  style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px' }}
                  onMouseEnter={() => setHoveredId(receta.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Heart button */}
                  <button
                    onClick={(e) => handleRemove(e, receta.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 2,
                      padding: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <FaHeart
                      style={{
                        color: hoveredId === receta.id ? '#ff6b6b' : '#ff4757',
                        fontSize: '1.5rem'
                      }}
                    />
                  </button>

                  <Card.Img
                    variant="top"
                    src={image}
                    alt={title}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                    onError={(e) => { e.target.src = "/img/receta-default.jpg"; }}
                  />
                  <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                      {summary.replace(/<[^>]*>/g, "").substring(0, 100)}...
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="info"
                      as={Link}
                      to={`/receta/${receta.id}`}
                      rel="noopener noreferrer"
                      className="w-100 text-white"
                    >
                      Ver Receta
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};