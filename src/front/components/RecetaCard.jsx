import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import {FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../Context/FavoritesContext";


 export const RecetaCard = ({receta}) => {
    const title = receta.title || receta.name;
    const image = receta.image || "https://via.placeholder.com/300";
    const summary =receta.summary || receta.instructions || "Descripcion no disponible";

    //contexto para manejo de favoritos
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [isHovered, setIsHovered] = useState(false);

    //verificacion de receta si existe en favoritos
    const isFavorite = favorites.some(fav => fav.id === receta.id);

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(isFavorite) {
            removeFavorite(receta.id);            
        } else {
            addFavorite(receta);
        }
    };


    return (
        <Card className="h-100 shadow-sm border-0 overflow-hidden"
              style={{
                transition: " transform 0.3s ease",
                borderRadius: "15px",
                position: "relative" // posicion absoluta del corazon
              }}
              onMouseEnter={(e) =>{ e.currentTarget.style.transform = "scale(1.03)"; setIsHovered(true);}}
              onMouseLeave={(e) =>{ e.currentTarget.style.transform = "scale(1)"; setIsHovered(false);}}>
            
            {/* boton de favoritos*/}
            <button 
            variant="link"
            onClick={handleFavorite}
            style={{
                position:"absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.7",
                border: "none"
            }}>
                {isFavorite || isHovered ? (
                    <FaHeart style={{color: "#ff4757", fontSize: "1.5rem"}} />
                ) : (
                    <FaRegHeart style={{color: "#ff4757", fontSize: "1.5rem"}} />
                )}
            </button>

            <Card.Img 
             variant="top"
             src={receta.image || '/img/receta-default.jpg'}
             alt={receta.title}
             style={{ height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px"}}
             onError={(e) => { e.target.src = '/img/receta-default.jpg';}}         
            />

            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {summary.replace(/<[^>]*>/g, "").substring(0, 100)}...                    
                </Card.Text>
            </Card.Body>

            <Card.Footer>
                <Button variant="info"
                 as={Link}
                 to={`/receta/${receta.id}`}                 
                 rel="noopener noreferrer"
                 className="w-100">
                    Ver Receta
                </Button>
            </Card.Footer>
        </Card>
    );
 };
