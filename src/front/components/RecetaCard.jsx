import React from "react";
import { Card, Button } from "react-bootstrap"

 export const RecetaCard = ({receta}) => {
    const title = receta.title || receta.name;
    const image = receta.image || "https://via.placeholder.com/300";
    const summary =receta.summary || receta.instructions || "Descripcion no disponible";
    return (
        <Card className="h-100 shadow-sm">
            <Card.Img 
             variant="top"
             src={image}
             alt={title}
             style={{ height: "200px", objectFit: "cover"}}
            />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {summary.replace(/<[^>]*>/g, "").substring(0, 100)}...                    
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button variant="primary" className="w-100">
                    Ver Receta
                </Button>
            </Card.Footer>
        </Card>
    );
 };
