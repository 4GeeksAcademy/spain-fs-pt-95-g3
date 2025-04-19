import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Carousel, Button } from "react-bootstrap";

export const Home = () => {
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

  return (
    <div className="container">
        <h1 className="display-4 fw-bold mb-4 text-center py-3 text-info" style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}>
            Bienvenidos a Que, Como y Cuando
          </h1>
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
              <Button variant="light">Ver recetas</Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

