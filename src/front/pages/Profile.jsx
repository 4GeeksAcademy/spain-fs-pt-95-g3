import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar, Button, Form } from "react-bootstrap";
import { FaFire, FaWalking, FaTrophy } from "react-icons/fa";

function getAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

const baseUrl = import.meta.env.VITE_API_URL;

export const Profile = () => {
  const datos = {
    pasos: 0,
    pesoActual: 85.0,
    pesoInicial: 87.0,
    objetivos: { alimentacion: "Estandar", pasosDiarios: 10000 },
    retos: [
      { nombre: "Dejar el chocolate", completado: false },
      { nombre: "Dejar el azúcar", completado: false }
    ]
  };

  // Widget and weight state
  const [mostrarInput, setMostrarInput] = useState(false);
  const [widgetAdded, setWidgetAdded] = useState(
    () => localStorage.getItem("widgetAdded") === "true"
  );
  const [pesoActual, setPesoActual] = useState(
    () => parseFloat(localStorage.getItem("pesoActual")) || datos.pesoActual
  );
  const [nuevoPeso, setNuevoPeso] = useState("");

  // User data state
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No hay token. Por favor inicia sesión.");
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) setUserData(data);
        else setError(data.error || "No se pudo cargar el perfil");
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      }
    };
    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Cargando perfil...</p>;

  // Handle saving weight
  const handleGuardarPeso = async () => {
    const peso = parseFloat(nuevoPeso);
    if (isNaN(peso)) return;

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${baseUrl}/api/profile/weight`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ weight: peso })
      });
      if (!res.ok) console.error("Error actualizando peso en servidor");
    } catch (err) {
      console.error(err);
    }

    setPesoActual(peso);
    localStorage.setItem("pesoActual", peso.toString());
    localStorage.setItem("widgetAdded", "true");
    setWidgetAdded(true);
    setMostrarInput(false);
    setNuevoPeso("");
  };

  return (
    <Container className="my-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Perfil</h1>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="outline-info" className="mx-2">
              Editar
            </Button>
          </div>
        </Col>
      </Row>

      {/* Profile Info */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">{userData.username}</Card.Title>
              <Card.Text className="text-center">
                {getAge(userData.birthdate)} años<br />
                <strong>Objetivo:</strong> {userData.objective}
              </Card.Text>
              <Row className="mt-3">
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaFire size={24} className="text-danger mb-2" />
                    <strong>Kcal restantes</strong>
                    <span>{userData.calorias_diarias}</span>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaWalking size={24} className="text-primary mb-2" />
                    <strong>Pasos</strong>
                    <span>{datos.pasos}</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Mis objetivos</Card.Title>
              <ul className="list-unstyled text-center">
                <li><strong>Calorías:</strong> {userData.calorias_diarias} kcal</li>
                <li><strong>Proteínas:</strong> {userData.proteinas} g</li>
                <li><strong>Grasas:</strong> {userData.grasas} g</li>
                <li><strong>Carbohidratos:</strong> {userData.carbohidratos} g</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Widget: Add, Input, Progress */}
      {!widgetAdded && !mostrarInput && (
        <Button
          variant="primary"
          className="w-100 mb-4 p-4 fs-4"
          onClick={() => setMostrarInput(true)}
        >
          Añadir widget
        </Button>
      )}

      {mostrarInput && !widgetAdded && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">Actualizar peso actual</h5>
                <Form.Control
                  type="number"
                  placeholder="Introduce tu peso"
                  className="mb-2"
                  value={nuevoPeso}
                  onChange={(e) => setNuevoPeso(e.target.value)}
                />
                <Button onClick={handleGuardarPeso} className="w-100">
                  Guardar peso
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {widgetAdded && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">Mi progreso</Card.Title>
                <div className="text-center m-3">
                  <FaTrophy size={32} className="text-warning" />
                  <h4 className="mt-2">
                    ¡Has perdido {Math.abs(userData.weight - pesoActual).toFixed(1)} Kg!
                  </h4>
                  <p>¡Enhorabuena! ¡Has alcanzado tu objetivo! 😊</p>
                </div>
                <div className="text-center">
                  <h5>{pesoActual} Kg</h5>
                  <ProgressBar
                    now={(pesoActual / userData.weight) * 100}
                    label={`${(
                      ((userData.weight - pesoActual) / userData.weight) *
                      100
                    ).toFixed(1)}%`}
                    variant="success"
                    className="mb-3"
                  />
                  <p>{userData.weight} Kg</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/*Retos*/}
      <Row>
          <Col>
            <Card className="shadow-sm">
             <Card.Body>
              <Card.Title className="text-center">Reto</Card.Title>
              {datos.retos.map((reto, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <span>{reto.nombre}</span>
                  <Button variant={reto.completado ? "success" : "primary"} size="sm">
                    {reto.completado ? "Completado" : "Empezar el reto"}
                  </Button>
                </div>              
              ))}
             </Card.Body>
            </Card>
          </Col>
        </Row>
  
        {/*Menu inferior*/}
        <Row className="fixed-bottom bg-white p-2 border-top">
          <Col className="d-flex justify-content-around">
            <Button variant="link">Diario</Button>
            <Button variant="link">Ayuno</Button>
            <Button variant="link">Recetas</Button>
            <Button variant="link" className="font-weight-bold">Perfil</Button>
          </Col>
        </Row>

        <div className="p-4">
          <p><strong>Fecha de nacimiento:</strong> {userData.birthdate}</p>
          <p><strong>Altura:</strong> {userData.height} cm</p>
        </div>
    </Container>
  );
};
