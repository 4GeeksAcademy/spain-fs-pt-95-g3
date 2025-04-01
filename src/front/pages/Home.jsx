import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  // Datos para el carrusel
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

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      return data;
    } catch (error) {
      if (error.message) throw new Error(
        `Could not fetch the message from the backend.
        Please check if the backend is running and the backend port is public.`
      );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(135deg, rgb(249, 249, 250) 20%, rgb(203, 212, 226) 100%",
      padding: "2rem 0"
    }}>
      <div className="container">
        <div className="text-center py-5">
          <h1 className="display-4 fw-bold mb-4" style={{
            color: "#2c3e50",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}>
            Bienvenidos a Que, Como y Cuando
          </h1>
          
          <div className="card shadow-lg border-0 mx-auto" style={{
            maxWidth: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "2rem"
          }}>
            <img 
              src="https://meifoods.co.in/wp-content/uploads/2024/07/ready-to-cook-3-800x800.jpg"
              className="img-fluid circle"
              alt="Recetas deliciosas"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover"
              }}
            />
          </div>
          
          <h3 className="py-3 px-4 d-inline-block rounded-pill" style={{
            background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            fontWeight: "600"
          }}>
            Recetas Deliciosas
          </h3>
          
          {store.hello && (
            <div className="mt-4 p-3 bg-white rounded shadow-sm d-inline-block">
              <p className="mb-0 text-muted">{store.hello}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};