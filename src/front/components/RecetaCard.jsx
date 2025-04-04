import React from "react";
import { Card, Button } from "react-bootstrap"

 export const RecetaCard = ({receta}) => {
    const title = receta.title || receta.name;
    const image = receta.image || "https://via.placeholder.com/300";
    const summary =receta.summary || receta.instructions || "Descripcion no disponible";
    return (
        <Card className="h-100 shadow-sm border-0 overflow-hidden"
              style={{
                transition: " transform 0.3s ease",
                borderRadius: "15px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <Card.Img 
             variant="top"
             src={image}
             alt={title}
             style={{ height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px"}}
            />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {summary.replace(/<[^>]*>/g, "").substring(0, 100)}...                    
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button variant="info" className="w-100">
                    Ver Receta
                </Button>
            </Card.Footer>
        </Card>
    );
 };
