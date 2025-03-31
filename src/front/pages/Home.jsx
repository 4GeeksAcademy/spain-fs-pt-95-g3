import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  // Imágenes de ejemplo para cada categoría
  const categoryImages = {
    Desayuno: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
    ],
    Almuerzo: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
    ],
    Cena: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8"
    ],
    Vegano: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd"
    ],
    Vegetariano: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      "https://images.unsplash.com/photo-1505576633757-0ac1084af824",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
    ]
  };

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

  const handleShowModal = (category) => {
    setCurrentCategory(category);
    // Selecciona una imagen aleatoria para la categoría
    const randomIndex = Math.floor(Math.random() * categoryImages[category].length);
    setCurrentImage(categoryImages[category][randomIndex]);
    setShowModal(true);
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(135deg, rgb(249, 249, 250) 0%, rgb(168, 184, 209) 100%",
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
          
          {/* Sección de botones de categorías */}
          <div className="mt-5 pt-4">
            <h4 className="mb-4">Explora nuestras categorías</h4>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {Object.keys(categoryImages).map((category) => (
                <Button
                  key={category}
                  variant="outline-primary"
                  className="category-btn"
                  onClick={() => handleShowModal(category)}
                  style={{
                    minWidth: "120px",
                    padding: "10px 15px",
                    borderRadius: "50px",
                    borderWidth: "2px",
                    fontWeight: "600"
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para mostrar imágenes */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={currentImage} 
            alt={currentCategory}
            className="img-fluid rounded"
            style={{ maxHeight: "60vh", width: "auto" }}
          />
          <div className="mt-3">
            <Button 
              variant="primary"
              onClick={() => handleShowModal(currentCategory)}
              className="me-2"
            >
              Ver otra imagen
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};