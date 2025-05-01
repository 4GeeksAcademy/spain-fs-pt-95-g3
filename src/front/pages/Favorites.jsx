import { useFavorites } from "../Context/FavoritesContext";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4"
      style={{
        color: "#2c3e50",
        fontWeight: "700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        paddingBottom: "10px"
      }}>Mis recetas favoritas</h1>
      {favorites.length === 0 ? (
        <p>No tienes recetas favoritas aún.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {favorites.map((receta) => {
            const title = receta.title || receta.name;
            const image = receta.image || "https://via.placeholder.com/300";
            const summary =
              receta.summary || receta.instructions || "Descripción no disponible";

            return (
              <Col key={receta.id}>
                <Card className="h-100 shadow rounded">
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
                    onError={(e) => {
                      e.target.src = "/img/receta-default.jpg";
                    }}
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

